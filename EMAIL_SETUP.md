# EmailJS Setup Guide for Contact Form

## 🎯 **Goal**
Set up email notifications so that when someone submits the contact form, you receive an email at `sugunstories@gmail.com`.

## 📧 **EmailJS Setup Steps**

### **Step 1: Create EmailJS Account**
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### **Step 2: Add Email Service**
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (since you want emails sent to sugunstories@gmail.com)
4. Connect your Gmail account (sugunstories@gmail.com)
5. **Save the Service ID** (it will look like `service_xxxxxxx`)

### **Step 3: Create Email Template**
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

**Subject:** New Contact Form Submission - {{from_name}}

**Email Body:**
```
Hello!

You have received a new contact form submission from your photography portfolio website.

📋 **Contact Details:**
- Name: {{from_name}}
- Email: {{from_email}}
- Event Type: {{event_type}}

💬 **Message:**
{{message}}

---
This message was sent from your photography portfolio contact form.
Reply directly to this email to respond to {{from_name}}.
```

4. **Save the Template ID** (it will look like `template_xxxxxxx`)

### **Step 4: Get Your Public Key**
1. Go to **Account** → **API Keys**
2. Copy your **Public Key**

### **Step 5: Update the Code**
Replace the placeholder values in `src/pages/Contact.tsx`:

```javascript
await emailjs.send(
  'YOUR_SERVICE_ID', // Replace with your actual service ID
  'YOUR_TEMPLATE_ID', // Replace with your actual template ID
  templateParams,
  'YOUR_PUBLIC_KEY' // Replace with your actual public key
);
```

## 🔧 **Alternative: Quick Setup with Gmail**

If you prefer a simpler setup, you can also use Gmail's built-in forwarding:

1. Set up Gmail filters to forward emails from your contact form
2. Use a service like Formspree or Netlify Forms
3. Configure the form to send to sugunstories@gmail.com

## 🚀 **Testing**

1. Fill out the contact form on your website
2. Submit the form
3. Check your email at sugunstories@gmail.com
4. You should receive a formatted email with all the contact details

## 📱 **EmailJS Free Plan Limits**
- 200 emails per month (free)
- Perfect for a photography portfolio
- Upgrade if you need more

## 🔒 **Security Notes**
- The public key is safe to use in frontend code
- EmailJS handles the email sending securely
- No sensitive credentials are exposed in your code

---

**Need Help?** 
- EmailJS Documentation: https://www.emailjs.com/docs/
- Support: https://www.emailjs.com/support/ 