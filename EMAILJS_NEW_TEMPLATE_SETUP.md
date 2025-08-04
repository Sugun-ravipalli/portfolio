# EmailJS New Template Setup - Contact Form Notifications

## 🎯 **The Problem**
Your current template `template_721vroo` is set up as an **Auto-Reply** template, which sends emails FROM you TO the client. But you want emails sent TO you when someone submits your contact form.

## 🔧 **Solution: Create a New Template**

### **Step 1: Create New Template**
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Click **Email Templates**
3. Click **Create New Template**
4. Name it: `contact_form_notification`

### **Step 2: Configure Template Settings**
Set these values in the template:

**Subject:** `New Contact Form Submission - {{from_name}}`

**To Email:** `sugunstories@gmail.com` (your email)

**From Name:** `Sugun Stories Contact Form`

**From Email:** Leave empty (will use default)

**Reply To:** `{{from_email}}` (so you can reply directly to the client)

### **Step 3: Template Content**
Use this content:

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

### **Step 4: Save and Get Template ID**
1. Click **Save Template**
2. **Copy the new template ID** (it will look like `template_xxxxxxx`)

### **Step 5: Update Your Code**
Once you have the new template ID, I'll update your contact form to use it.

## 🧪 **Alternative: Use Your Existing Template**

If you want to keep using `template_721vroo`, you need to change its configuration:

### **Update template_721vroo Settings:**
1. Go to your existing template
2. Change **To Email** from `{{email}}` to `sugunstories@gmail.com`
3. Change **Subject** to `New Contact Form Submission - {{name}}`
4. Update the content to be a notification (not an auto-reply)

## 🎯 **Recommended Approach**

**Create a new template** specifically for contact form notifications. This keeps your auto-reply template separate and gives you more flexibility.

## 📧 **What You'll Receive**

With the new template, you'll get emails like this:

```
Subject: New Contact Form Submission - John Doe

Hello!

You have received a new contact form submission from your photography portfolio website.

📋 Contact Details:
- Name: John Doe
- Email: john@example.com
- Event Type: Wedding Photography

💬 Message:
Hi! I'm getting married next summer and would love to discuss photography options...

---
This message was sent from your photography portfolio contact form.
Reply directly to this email to respond to John Doe.
```

## 🚀 **Next Steps**

1. **Create the new template** in EmailJS dashboard
2. **Get the new template ID**
3. **Share the template ID** with me
4. **I'll update your code** to use the new template

**This will fix the issue and you'll start receiving contact form submissions at sugunstories@gmail.com!** 