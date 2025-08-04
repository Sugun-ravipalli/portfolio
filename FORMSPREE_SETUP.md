# Formspree Setup Guide (Alternative to EmailJS)

## 🎯 **Goal**
Set up email notifications using Formspree (simpler alternative) so that when someone submits the contact form, you receive an email at `sugunstories@gmail.com`.

## 📧 **Formspree Setup Steps**

### **Step 1: Create Formspree Account**
1. Go to [Formspree.io](https://formspree.io/)
2. Sign up for a free account
3. Verify your email address

### **Step 2: Create a New Form**
1. Click **New Form**
2. Name it "Photography Portfolio Contact"
3. **Save the Form ID** (it will look like `xrgjqkqw`)

### **Step 3: Update Contact Form**
Replace the form in `src/pages/Contact.tsx` with this action:

```jsx
<form 
  action="https://formspree.io/f/YOUR_FORM_ID" 
  method="POST"
  onSubmit={handleSubmit} 
  className="space-y-6"
>
```

### **Step 4: Configure Email Settings**
1. In Formspree dashboard, go to **Settings**
2. Set **Email To**: sugunstories@gmail.com
3. Set **Email From**: noreply@formspree.io
4. Customize email subject and template

## 🚀 **Quick Implementation**

If you want to implement this right now, here's the quick way:

1. **Sign up at Formspree.io**
2. **Create a new form**
3. **Get your form ID**
4. **Replace the form action in Contact.tsx**

The form will automatically send emails to your Gmail account!

## 📱 **Formspree Free Plan**
- 50 submissions per month (free)
- Perfect for a photography portfolio
- Upgrade if you need more

## 🔒 **Security**
- Formspree handles spam protection
- No sensitive data in your code
- GDPR compliant

---

**Choose Your Option:**
- **EmailJS**: More customizable, 200 emails/month
- **Formspree**: Simpler setup, 50 submissions/month

Both will send emails to sugunstories@gmail.com when someone submits your contact form! 