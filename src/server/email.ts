import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const escapeHTML = (str: string | undefined) => {
  if (!str) return "";
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
};

const getTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not fully configured. Emails may not send correctly.");
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const getFrom = () => process.env.SMTP_FROM || '"Store Admin" <noreply@example.com>';

export const sendPasswordResetEmail = async (email: string, resetToken: string, origin: string, isAdmin = false) => {
  const resetUrl = isAdmin 
    ? `${origin}/admin/reset-password?token=${resetToken}`
    : `${origin}/reset-password?token=${resetToken}`;
    
  const transporter = getTransporter();

  await transporter.sendMail({
    from: getFrom(),
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Password Reset</h2>
        <p>You requested a password reset. Click the button below to reset your password.</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background-color:#000;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;">Reset Password</a>
        </div>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
      </div>
    `,
  });
};

interface PaymentInfo {
  customerName: string;
  customerEmail: string;
  status?: string;
  razorpayOrderId: string;
  productName: string;
  quantity: number;
  amount: number;
  trackingId?: string;
  trackingUrl?: string;
  shippingAddress?: string;
}

export const sendOrderStatusEmail = async (payment: PaymentInfo) => {
  const transporter = getTransporter();

  let statusMessage = "Your order status has been updated.";
  if (payment.status === "shipped") statusMessage = "Your order has been shipped!";
  if (payment.status === "delivered") statusMessage = "Your order has been delivered!";
  if (payment.status === "cancelled") statusMessage = "Your order has been cancelled.";

  await transporter.sendMail({
    from: getFrom(),
    to: payment.customerEmail,
    subject: `Order Status Update - ${payment.razorpayOrderId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Order Status Update</h2>
        <p>Hi ${escapeHTML(payment.customerName)},</p>
        <p>${statusMessage}</p>
        <p><strong>Current Status:</strong> <span style="text-transform: uppercase;">${payment.status}</span></p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <p><strong>Product:</strong> ${escapeHTML(payment.productName)}</p>
          <p><strong>Quantity:</strong> ${payment.quantity}</p>
          <p><strong>Total:</strong> ₹${payment.amount}</p>
          ${payment.trackingId ? `<p><strong>Tracking ID:</strong> ${payment.trackingId}</p>` : ''}
          ${payment.trackingUrl ? `<p><a href="${payment.trackingUrl}">Track your package</a></p>` : ''}
        </div>
        
        <p>Thank you for shopping with us!</p>
      </div>
    `,
  });
};

export const sendOrderInvoiceEmail = async (payment: PaymentInfo) => {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: getFrom(),
    to: payment.customerEmail,
    subject: `Order Confirmation - ${payment.razorpayOrderId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Thank you for your order!</h2>
        <p>Hi ${escapeHTML(payment.customerName)},</p>
        <p>We've successfully received your payment for the following order:</p>
        <table style="width:100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px; border: 1px solid #eaeaea;">
          <tr style="background-color: #f9f9f9;">
            <th style="text-align:left; padding: 12px; border-bottom: 1px solid #eaeaea;">Product</th>
            <th style="text-align:center; padding: 12px; border-bottom: 1px solid #eaeaea;">Quantity</th>
            <th style="text-align:right; padding: 12px; border-bottom: 1px solid #eaeaea;">Price</th>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eaeaea;">${escapeHTML(payment.productName)}</td>
            <td style="text-align:center; padding: 12px; border-bottom: 1px solid #eaeaea;">${payment.quantity}</td>
            <td style="text-align:right; padding: 12px; border-bottom: 1px solid #eaeaea;">₹${payment.amount}</td>
          </tr>
          <tr>
            <td colspan="2" style="text-align:right; padding: 12px; font-weight: bold;">Total Paid:</td>
            <td style="text-align:right; padding: 12px; font-weight: bold;">₹${payment.amount}</td>
          </tr>
        </table>
        
        <h3>Shipping Address</h3>
        <p style="background-color: #f9f9f9; padding: 15px; border-radius: 6px;">
          ${escapeHTML(payment.shippingAddress)}
        </p>
        
        <p style="margin-top: 30px;">We will notify you once your order has shipped.</p>
      </div>
    `,
  });
};

export const sendTrackingEmail = async (payment: PaymentInfo) => {
  const transporter = getTransporter();
  
  await transporter.sendMail({
    from: getFrom(),
    to: payment.customerEmail,
    subject: `Your Order Has Shipped! - ${payment.razorpayOrderId}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2>Your order is on its way!</h2>
        <p>Hi ${escapeHTML(payment.customerName)},</p>
        <p>Your order containing <strong>${escapeHTML(payment.productName)}</strong> has been shipped.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 20px 0;">
          ${payment.trackingId ? `<p style="margin-top:0;"><strong>Tracking ID:</strong> ${payment.trackingId}</p>` : ''}
          ${payment.trackingUrl ? `
            <div style="margin-top: 15px;">
              <a href="${payment.trackingUrl}" style="display:inline-block;padding:10px 20px;background-color:#000;color:#fff;text-decoration:none;border-radius:5px;font-weight:bold;">Track your package</a>
            </div>
          ` : ''}
        </div>
        
        <p>Thank you for shopping with us!</p>
      </div>
    `,
  });
};
