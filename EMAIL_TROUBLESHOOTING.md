# EmailJS Troubleshooting Guide

## 🚨 **Why You're Not Receiving Emails**

Let's systematically debug this issue:

## 🔍 **Step 1: Check Browser Console**

### **How to Open Console:**
1. **Right-click** on your contact page
2. **Select "Inspect"** or press `F12`
3. **Click "Console"** tab
4. **Fill out and submit** the contact form
5. **Look for error messages** in the console

### **What to Look For:**
- ✅ **Success**: "Email sent successfully" message
- ❌ **Error**: Any red error messages
- 📊 **Debug Info**: Form data and EmailJS config

## 🔧 **Step 2: Common Issues & Solutions**

### **Issue 1: EmailJS Service Not Connected**
**Symptoms**: "Service not found" error
**Solution**: 
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Check if `sugunstories_emails` service exists
3. Verify it's connected to Gmail

### **Issue 2: Template Not Found**
**Symptoms**: "Template not found" error
**Solution**:
1. Go to EmailJS Templates
2. Verify `template_721vroo` exists
3. Check template variables match: `{{name}}`, `{{email}}`, `{{event_type}}`, `{{message}}`

### **Issue 3: Public Key Issues**
**Symptoms**: "Invalid public key" error
**Solution**:
1. Go to EmailJS Account → API Keys
2. Verify public key: `cCU4hIQZDsgyXVCPa`
3. Make sure it's active

### **Issue 4: Gmail Spam Filter**
**Symptoms**: No errors, but no emails received
**Solution**:
1. Check **Spam/Junk folder** in Gmail
2. Add `noreply@emailjs.com` to contacts
3. Check Gmail filters

### **Issue 5: Template Variables Mismatch**
**Symptoms**: Email sends but content is empty
**Solution**:
1. Verify template uses: `{{name}}`, `{{email}}`, `{{event_type}}`, `{{message}}`
2. Check form field names match

## 🧪 **Step 3: Test with Simple Template**

### **Create a Test Template:**
1. Go to EmailJS Templates
2. Create new template: `test_template`
3. Use this simple content:

```
Test Email

Name: {{name}}
Email: {{email}}
Message: {{message}}

This is a test email from your contact form.
```

### **Test the Form:**
1. Fill out contact form
2. Submit
3. Check console for errors
4. Check email

## 📧 **Step 4: EmailJS Dashboard Check**

### **Check EmailJS Dashboard:**
1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Look for:
   - **Email Services**: `sugunstories_emails` should be listed
   - **Email Templates**: `template_721vroo` should be listed
   - **API Keys**: `cCU4hIQZDsgyXVCPa` should be active
   - **Usage**: Check if emails are being sent

## 🔄 **Step 5: Alternative Test**

### **Test with Formspree (Backup):**
If EmailJS continues to fail, we can quickly switch to Formspree:

1. Go to [Formspree.io](https://formspree.io/)
2. Create account and form
3. Get form ID
4. Update contact form action

## 📱 **Step 6: Manual Test**

### **Test EmailJS Manually:**
Open browser console and run this test:

```javascript
// Test EmailJS directly
emailjs.send(
  'sugunstories_emails',
  'template_721vroo',
  {
    name: 'Test User',
    email: 'test@example.com',
    event_type: 'Test Event',
    message: 'This is a test message'
  },
  'cCU4hIQZDsgyXVCPa'
).then(
  function(response) {
    console.log('SUCCESS!', response);
  },
  function(error) {
    console.log('FAILED...', error);
  }
);
```

## 🎯 **Most Likely Issues:**

1. **Gmail Spam Filter** - Check spam folder
2. **Template Variables** - Make sure they match exactly
3. **Service Connection** - Verify Gmail connection
4. **Public Key** - Check if it's active

## 📞 **Next Steps:**

1. **Test the form** and check console
2. **Share any error messages** you see
3. **Check spam folder** in Gmail
4. **Verify EmailJS dashboard** settings

**Let me know what you find in the console, and I'll help you fix the specific issue!** 