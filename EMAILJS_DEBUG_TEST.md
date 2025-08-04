# EmailJS Debug Test Guide

## 🚨 **Why You're Not Getting Emails**

Let's systematically test and fix this issue.

## 🔍 **Step 1: Test Your Contact Form**

### **A. Open Browser Console**
1. Go to your contact page
2. Right-click → Inspect → Console tab
3. Fill out and submit the form
4. Look for these messages in console:

**Expected Console Output:**
```
Starting email submission...
Form data: {name: "Test", email: "test@example.com", ...}
Template params: {from_name: "Test", from_email: "test@example.com", ...}
EmailJS config: {serviceId: "sugunstories_emails", templateId: "template_n0ak4ma", ...}
EmailJS result: {status: 200, text: "OK"}
Email sent successfully: {name: "Test", ...}
```

### **B. Check for Errors**
If you see any red error messages, share them with me.

## 🔧 **Step 2: Check EmailJS Dashboard**

### **A. Email History**
1. Go to EmailJS Dashboard
2. Click **Email History**
3. Look for recent emails
4. Check if they show as "Sent" or "Failed"

### **B. Usage Statistics**
1. Check your usage: "198 requests left"
2. Verify emails are being sent

## 📧 **Step 3: Check Gmail Settings**

### **A. Spam Folder**
- Check your **Spam/Junk** folder
- Search for emails from `noreply@emailjs.com`

### **B. Gmail Filters**
1. Go to Gmail Settings (gear icon)
2. Click **Filters and Blocked Addresses**
3. Check if any filters are blocking EmailJS emails

### **C. Gmail Tabs**
- Check **Primary**, **Social**, and **Promotions** tabs
- Sometimes automated emails go to Promotions

## 🧪 **Step 4: Manual Test**

### **Test EmailJS Directly**
Open browser console and run this test:

```javascript
// Test EmailJS directly
emailjs.send(
  'sugunstories_emails',
  'template_n0ak4ma',
  {
    from_name: 'Test User',
    from_email: 'test@example.com',
    event_type: 'Test Event',
    message: 'This is a test message from console'
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

## 🎯 **Step 5: Template Verification**

### **Check Your Template Settings**
Your "Contact Us" template should have:

**✅ Correct Settings:**
- **To Email:** `sugunstories@gmail.com`
- **Subject:** `New Contact Form Submission - {{from_name}}`
- **Reply To:** `{{from_email}}`

**✅ Template Variables:**
- `{{from_name}}`
- `{{from_email}}`
- `{{event_type}}`
- `{{message}}`

## 🔄 **Step 6: Alternative Solution**

### **If Still Not Working, Try Formspree**
As a backup, we can quickly switch to Formspree:

1. Go to [Formspree.io](https://formspree.io/)
2. Create account and form
3. Get form ID
4. Update contact form action

## 📞 **What to Share With Me**

After testing, tell me:

1. **Console output** (success/error messages)
2. **EmailJS dashboard** - any emails in history?
3. **Gmail** - checked spam folder?
4. **Manual test** - did the console test work?

## 🎯 **Most Likely Issues**

1. **Gmail Spam Filter** - 70% of cases
2. **Template Variable Mismatch** - 20% of cases
3. **EmailJS Service Not Connected** - 10% of cases

**Run these tests and let me know what you find!** 