# EmailJS Template Setup for Sugun Stories

## 🎯 **Your Credentials (Already Configured)**
- **Service ID**: `sugunstories_emails`
- **Public Key**: `cCU4hIQZDsgyXVCPa`
- **Target Email**: `sugunstories@gmail.com`

## 📧 **Step-by-Step Template Setup**

### **Step 1: Go to EmailJS Dashboard**
1. Visit [EmailJS.com](https://www.emailjs.com/)
2. Sign in to your account
3. Go to **Email Templates** section

### **Step 2: Create New Template**
1. Click **Create New Template**
2. Name it: `template_contact_form`
3. Set **Subject**: `Thank you for contacting Sugun Stories!`

### **Step 3: Copy This Template Content**

**Email Body:**
```
Hi {{name}},

Thank you for getting in touch with **Sugun Stories**! I truly appreciate your interest in collaborating. Whether it's a birthday, housewarming, pre-wedding shoot, or any special event — I'm always excited to tell stories through powerful visuals.

I'll review your message and get back to you within **24–48 hours**.  
If it's urgent, feel free to reach out to me directly at:

📧 sugunstories@gmail.com

Meanwhile, feel free to check out my recent work at:  
🌐 https://sugunstories-ruby.vercel.app

Looking forward to capturing great stories together!

Warm regards,  
**Sai Sugun Ravipalli**  
📸 Sugun Stories  
📧 sugunstories@gmail.com
```

### **Step 4: Save Template**
1. Click **Save Template**
2. **Copy the Template ID** (it will look like `template_xxxxxxx`)

### **Step 5: Update Code with Template ID**
Once you have the template ID, update this line in `src/pages/Contact.tsx`:

```javascript
await emailjs.send(
  'sugunstories_emails', // ✅ Already set
  'YOUR_TEMPLATE_ID_HERE', // Replace with your actual template ID
  templateParams,
  'cCU4hIQZDsgyXVCPa' // ✅ Already set
);
```

## 🚀 **Testing Your Setup**

### **Test the Contact Form:**
1. Go to your website: https://sugunstories-ruby.vercel.app/contact
2. Fill out the contact form with test data:
   - **Name**: Test User
   - **Email**: your-test-email@gmail.com
   - **Event Type**: Wedding Photography
   - **Message**: This is a test message
3. Click **Submit**
4. Check your email at `sugunstories@gmail.com`

### **What You Should Receive:**
- **From**: Your EmailJS service
- **To**: sugunstories@gmail.com
- **Subject**: Thank you for contacting Sugun Stories!
- **Content**: The formatted template with the client's details

## 🔧 **Troubleshooting**

### **If emails aren't sending:**
1. **Check EmailJS Dashboard**: Look for any error messages
2. **Verify Service**: Make sure `sugunstories_emails` service is connected to Gmail
3. **Check Template ID**: Ensure the template ID is correct in the code
4. **Test in Console**: Check browser console for any JavaScript errors

### **If you need to modify the template:**
1. Go to EmailJS dashboard
2. Edit the template
3. Save changes
4. The changes will apply immediately

## 📱 **Template Variables Used**
- `{{name}}` - Client's name from form
- `{{email}}` - Client's email from form
- `{{event_type}}` - Selected event type
- `{{message}}` - Client's message

## 🎉 **You're All Set!**

Once you create the template and get the template ID, your contact form will:
1. ✅ Send emails to sugunstories@gmail.com
2. ✅ Use your professional template
3. ✅ Include all client details
4. ✅ Provide your contact information
5. ✅ Direct clients to your website

**Next Step**: Create the template in EmailJS dashboard and get your template ID! 