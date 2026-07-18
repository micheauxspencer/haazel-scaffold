import { brand } from "@/lib/brand.config";

/**
 * POST /api/quote — leadgen QuoteForm submission handler.
 *
 * Next 16 route handlers use the Web Request/Response APIs directly
 * (see node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md):
 * no `bodyParser` config, `Response.json()` is the documented idiom instead
 * of always reaching for `NextResponse.json`, and POST handlers are never
 * cached regardless of any `dynamic`/`revalidate` export — that caching
 * story only applies to GET. There's no dynamic route segment here, so the
 * `RouteContext<'...'>` typed-params helper (new in this version, generated
 * by `next dev`/`next build`/`next typegen`) doesn't come into play.
 */

export interface QuotePayload {
  name: string;
  phone: string;
  email: string;
  service: string;
  message?: string;
  /** Honeypot — real users never fill this in. */
  website?: string;
}

type FieldErrors = Partial<Record<"name" | "phone" | "email" | "service", string>>;

function validate(payload: Partial<QuotePayload>): FieldErrors {
  const errors: FieldErrors = {};

  if (!payload.name || !payload.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!payload.phone || !payload.phone.trim()) {
    errors.phone = "Phone is required.";
  } else if (payload.phone.replace(/\D/g, "").length < 7) {
    errors.phone = "Enter a valid phone number.";
  }

  if (!payload.email || !payload.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!payload.service || !payload.service.trim()) {
    errors.service = "Select a service.";
  }

  return errors;
}

export async function POST(request: Request) {
  let body: Partial<QuotePayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, errors: { form: "Invalid request body." } }, { status: 400 });
  }

  // Honeypot: bots that fill the hidden "website" field get a silent 200 so
  // the response gives them no signal the submission was rejected.
  if (body.website) {
    return Response.json({ ok: true, delivered: false });
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return Response.json({ ok: false, errors }, { status: 400 });
  }

  const { name, phone, email, service, message } = body as QuotePayload;
  const to = process.env.QUOTE_TO_EMAIL || brand.client.email || "";
  const from = `quotes@${brand.client.domain}`;

  if (process.env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to,
          reply_to: email,
          subject: `New quote request — ${service}`,
          text: [
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Email: ${email}`,
            `Service: ${service}`,
            "",
            message ? `Message:\n${message}` : "No message provided.",
          ].join("\n"),
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error("Resend API error:", res.status, detail);
        return Response.json(
          { ok: false, errors: { form: "Could not send your request. Please call us instead." } },
          { status: 502 },
        );
      }

      return Response.json({ ok: true, delivered: true });
    } catch (err) {
      console.error("Failed to reach Resend:", err);
      return Response.json(
        { ok: false, errors: { form: "Could not send your request. Please call us instead." } },
        { status: 502 },
      );
    }
  }

  console.log("New quote request (RESEND_API_KEY not set — set it in .env.local to deliver quotes):", {
    name,
    phone,
    email,
    service,
    message,
    to,
    from,
  });

  return Response.json({
    ok: true,
    delivered: false,
    note: "Set RESEND_API_KEY to deliver quotes",
  });
}
