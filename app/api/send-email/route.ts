import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data } = body;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let subject = "";
    let html = "";

    if (type === "contact") {
      subject = `New Contact Form Submission: ${data.subject || "General Inquiry"}`;
      html = `
        <h2>New Contact Inquiry</h2>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `;
    } else if (type === "checkout") {
      subject = `New Order Received from ${data.shipping.firstName} ${data.shipping.lastName}`;
      const itemsHtml = data.items
        .map(
          (item: any) => `
        <tr>
          <td>${item.name} (${item.option})</td>
          <td>${item.qty}</td>
          <td>Rs.${item.priceNum.toLocaleString()}</td>
          <td>Rs.${(item.priceNum * item.qty).toLocaleString()}</td>
        </tr>
      `,
        )
        .join("");

      html = `
        <h2>New Order Details</h2>
        <h3>Shipping Information</h3>
        <p><strong>Name:</strong> ${data.shipping.firstName} ${data.shipping.lastName}</p>
        <p><strong>Email:</strong> ${data.shipping.email}</p>
        <p><strong>Phone:</strong> ${data.shipping.phone}</p>
        <p><strong>Address:</strong> ${data.shipping.address}, ${data.shipping.city}, ${data.shipping.postalCode}</p>
        
        <h3>Order Summary</h3>
        <table border="1" cellpadding="5" style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <th colspan="3" align="right">Total</th>
              <th>Rs.${data.totalPrice.toLocaleString()}</th>
            </tr>
          </tfoot>
        </table>
      `;

      // ── Customer confirmation email ──────────────────────────────────────
      const customerItemsHtml = data.items
        .map(
          (item: any) => `
          <tr>
            <td style="padding:10px 12px; border-bottom:1px solid #f0e8d8;">
              <span style="font-weight:600; color:#1a1a1a;">${item.name}</span>
              ${item.option ? `<br/><span style="font-size:12px; color:#C6A15B;">${item.option}</span>` : ""}
            </td>
            <td style="padding:10px 12px; border-bottom:1px solid #f0e8d8; text-align:center; color:#555;">${item.qty}</td>
            <td style="padding:10px 12px; border-bottom:1px solid #f0e8d8; text-align:right; color:#555;">Rs.${item.priceNum.toLocaleString()}</td>
            <td style="padding:10px 12px; border-bottom:1px solid #f0e8d8; text-align:right; font-weight:600; color:#1a1a1a;">Rs.${(item.priceNum * item.qty).toLocaleString()}</td>
          </tr>
        `,
        )
        .join("");

      const customerConfirmationHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Order Confirmation</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f9f6f1; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f6f1; padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border:1px solid #e8dfd0;">

                  <!-- Header -->
                  <tr>
                    <td style="background-color:#1a1a1a; padding:32px 40px; text-align:center;">
                      <p style="margin:0; font-size:11px; letter-spacing:4px; color:#C6A15B; text-transform:uppercase; font-weight:600;">Saleem Butt Jewellers</p>
                      <h1 style="margin:10px 0 0; font-size:26px; color:#ffffff; font-weight:300; letter-spacing:2px;">Order Confirmed</h1>
                    </td>
                  </tr>

                  <!-- Thank You Banner -->
                  <tr>
                    <td style="background-color:#C6A15B; padding:16px 40px; text-align:center;">
                      <p style="margin:0; font-size:13px; color:#ffffff; letter-spacing:2px; text-transform:uppercase; font-weight:600;">
                        Thank you for your order, ${data.shipping.firstName}!
                      </p>
                    </td>
                  </tr>

                  <!-- Intro -->
                  <tr>
                    <td style="padding:36px 40px 20px;">
                      <p style="margin:0; font-size:15px; color:#555; line-height:1.7;">
                        We've received your order and it's being carefully prepared. You'll be contacted shortly to confirm delivery details.
                      </p>
                    </td>
                  </tr>

                  <!-- Order Summary Table -->
                  <tr>
                    <td style="padding:0 40px 30px;">
                      <p style="margin:0 0 12px; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#C6A15B;">Order Summary</p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8dfd0; border-radius:2px;">
                        <thead>
                          <tr style="background-color:#faf8f4;">
                            <th style="padding:10px 12px; text-align:left; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; border-bottom:1px solid #e8dfd0;">Item</th>
                            <th style="padding:10px 12px; text-align:center; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; border-bottom:1px solid #e8dfd0;">Qty</th>
                            <th style="padding:10px 12px; text-align:right; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; border-bottom:1px solid #e8dfd0;">Price</th>
                            <th style="padding:10px 12px; text-align:right; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:#888; border-bottom:1px solid #e8dfd0;">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${customerItemsHtml}
                        </tbody>
                        <tfoot>
                          <tr style="background-color:#faf8f4;">
                            <td colspan="3" style="padding:14px 12px; text-align:right; font-weight:700; font-size:14px; color:#1a1a1a;">Total</td>
                            <td style="padding:14px 12px; text-align:right; font-weight:700; font-size:16px; color:#C6A15B;">Rs.${data.totalPrice.toLocaleString()}</td>
                          </tr>
                          <tr>
                            <td colspan="4" style="padding:8px 12px; text-align:right; font-size:12px; color:#4caf50; font-weight:600; letter-spacing:1px; text-transform:uppercase;">
                              ✓ Free Shipping
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </td>
                  </tr>

                  <!-- Shipping Details -->
                  <tr>
                    <td style="padding:0 40px 30px;">
                      <p style="margin:0 0 12px; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#C6A15B;">Shipping To</p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4; border:1px solid #e8dfd0; padding:20px;">
                        <tr><td style="padding:6px 20px;">
                          <p style="margin:0; font-size:14px; color:#1a1a1a; font-weight:600;">${data.shipping.firstName} ${data.shipping.lastName}</p>
                          <p style="margin:4px 0 0; font-size:13px; color:#666; line-height:1.6;">
                            ${data.shipping.address}<br/>
                            ${data.shipping.city}, ${data.shipping.postalCode}
                          </p>
                          <p style="margin:8px 0 0; font-size:13px; color:#666;">📞 ${data.shipping.phone}</p>
                        </td></tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Payment Method -->
                  <tr>
                    <td style="padding:0 40px 30px;">
                      <p style="margin:0 0 12px; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#C6A15B;">Payment Method</p>
                      <p style="margin:0; font-size:14px; color:#1a1a1a; background:#faf8f4; border:1px solid #e8dfd0; padding:14px 20px; display:inline-block;">
                        💵 Cash on Delivery (COD)
                      </p>
                    </td>
                  </tr>

                  <!-- What's Next -->
                  <tr>
                    <td style="padding:0 40px 30px;">
                      <p style="margin:0 0 12px; font-size:11px; font-weight:700; letter-spacing:3px; text-transform:uppercase; color:#C6A15B;">What Happens Next?</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="32" valign="top" style="padding:4px 0;">
                            <div style="width:24px; height:24px; background:#C6A15B; color:#fff; border-radius:50%; text-align:center; line-height:24px; font-size:12px; font-weight:700;">1</div>
                          </td>
                          <td style="padding:4px 0 4px 12px; font-size:14px; color:#555; line-height:1.5;">Our team will review your order and reach out to you at <strong>${data.shipping.phone}</strong> to confirm.</td>
                        </tr>
                        <tr>
                          <td width="32" valign="top" style="padding:4px 0;">
                            <div style="width:24px; height:24px; background:#C6A15B; color:#fff; border-radius:50%; text-align:center; line-height:24px; font-size:12px; font-weight:700;">2</div>
                          </td>
                          <td style="padding:4px 0 4px 12px; font-size:14px; color:#555; line-height:1.5;">Your jewellery will be carefully packed and dispatched to your address.</td>
                        </tr>
                        <tr>
                          <td width="32" valign="top" style="padding:4px 0;">
                            <div style="width:24px; height:24px; background:#C6A15B; color:#fff; border-radius:50%; text-align:center; line-height:24px; font-size:12px; font-weight:700;">3</div>
                          </td>
                          <td style="padding:4px 0 4px 12px; font-size:14px; color:#555; line-height:1.5;">Pay on delivery — no payment required until your order arrives.</td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td style="padding:0 40px;">
                      <hr style="border:none; border-top:1px solid #e8dfd0; margin:0;" />
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding:28px 40px; text-align:center;">
                      <p style="margin:0 0 6px; font-size:12px; color:#aaa; letter-spacing:1px; text-transform:uppercase;">Questions? Contact us</p>
                      <p style="margin:0; font-size:13px; color:#C6A15B;">sadiakamal2468@gmail.com</p>
                      <p style="margin:16px 0 0; font-size:11px; color:#bbb; letter-spacing:2px; text-transform:uppercase;">© Saleem Butt Jewellers — Heritage Craftsmanship</p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      // Send confirmation email to the customer
      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
        to: data.shipping.email,
        subject: `Order Confirmed — Thank you, ${data.shipping.firstName}! 🛍️`,
        html: customerConfirmationHtml,
      });
      // ────────────────────────────────────────────────────────────────────
    } else if (type === "newsletter") {
      subject = "New Newsletter Subscription";
      html = `
        <h2>New Newsletter Subscription</h2>
        <p><strong>Email:</strong> ${data.email}</p>
      `;
    }

    // Send the internal owner notification email (always)
    const mailOptions = {
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: process.env.SMTP_TO_EMAIL,
      subject: subject,
      html: html,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send email", error: error.message },
      { status: 500 },
    );
  }
}
