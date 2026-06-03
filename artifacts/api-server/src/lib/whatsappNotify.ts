const WA_MESSAGES_URL = (phoneNumberId: string) =>
  `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`;

export interface EnquiryNotifyData {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  company?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;
  customerType?: string | null;
  productName?: string | null;
  selectedSize?: string | null;
  quantity?: string | null;
  message?: string | null;
  inquiryType?: string | null;
  intentLabel?: string | null;
  estimatedPort?: string | null;
  estimatedPriceRange?: string | null;
  currency?: string | null;
  createdAt?: Date | null;
}

export async function sendWhatsAppNotification(
  data: EnquiryNotifyData,
  log?: { info: (...a: any[]) => void; warn: (...a: any[]) => void; error: (...a: any[]) => void }
): Promise<void> {
  const logger = log ?? console;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const notifyTo = process.env.WHATSAPP_NOTIFY_TO;

  if (!token || !phoneNumberId || !notifyTo) {
    logger.warn(
      "WhatsApp notify skipped — WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_NOTIFY_TO must all be set"
    );
    return;
  }

  const ref = `EQ-${String(data.id).padStart(4, "0")}`;
  const location = [data.city, data.state, data.pincode].filter(Boolean).join(", ") || "—";
  const ts = new Date(data.createdAt ?? Date.now()).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const lines = [
    `🛎 *New XIYORA Enquiry — ${ref}*`,
    "",
    `*Type:* ${data.intentLabel ?? data.inquiryType ?? "General"}`,
    `*Product:* ${data.productName ?? "—"}${data.selectedSize ? ` (${data.selectedSize})` : ""}`,
    `*Quantity:* ${data.quantity ?? "—"}`,
    data.estimatedPriceRange ? `*Price Range:* ${data.estimatedPriceRange}` : null,
    "",
    `*Name:* ${data.name}`,
    `*Phone:* ${data.phone}`,
    data.email ? `*Email:* ${data.email}` : null,
    data.company ? `*Company:* ${data.company}` : null,
    data.customerType ? `*Customer Type:* ${data.customerType}` : null,
    "",
    `*Location:* ${location}`,
    data.estimatedPort ? `*Delivery:* ${data.estimatedPort}` : null,
    "",
    data.message ? `*Message:* ${data.message}` : null,
    `*Received:* ${ts}`,
  ].filter((l): l is string => l !== null);

  const body = lines.join("\n");

  try {
    const resp = await fetch(WA_MESSAGES_URL(phoneNumberId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: notifyTo,
        type: "text",
        text: { body, preview_url: false },
      }),
    });

    const result = (await resp.json()) as {
      messages?: { id: string }[];
      error?: { message: string };
    };

    if (resp.ok && result?.messages?.[0]?.id) {
      logger.info(`WhatsApp enquiry notification sent — msgId: ${result.messages[0].id}`);
    } else {
      logger.warn({ status: resp.status, error: result?.error }, "WhatsApp notify: non-OK response");
    }
  } catch (err) {
    logger.error({ err }, "WhatsApp notify: network/fetch error");
  }
}
