// Keep your current Paystack link
export let PAYMENT_LINK = "https://paystack.shop/pay/0gu44fw2h-";

export function setPaymentLink(url) {
  PAYMENT_LINK = url;
}

export function initPayment(buttonSelector) {
  // 1. Get the main "Subscribe" button
  const btn = document.querySelector(buttonSelector);
  
  // 2. Get the HTML elements we placed inside the VVIP box in Step 1
  const standardActions = document.getElementById('standard-actions');
  const confirmationUI = document.getElementById('payment-confirmation-ui');
  const confirmBtn = document.getElementById('confirm-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  if (!btn) return;

  // When "Subscribe Now" is clicked
  btn.addEventListener('click', (e) => {
    e.preventDefault(); // Stop page from jumping

    if (!PAYMENT_LINK || PAYMENT_LINK.includes('REPLACE_WITH')) {
      alert('Payment is not configured.');
      return;
    }

    // Instead of creating a modal at the bottom of the page, 
    // we simply hide the buttons and show the confirmation text inside the box.
    if (standardActions && confirmationUI) {
      standardActions.style.display = 'none';
      confirmationUI.style.display = 'block';
    } else {
      // Fallback: If for some reason the HTML isn't there, just redirect
      window.location.href = PAYMENT_LINK;
    }
  });

  // Handle the "Proceed" button inside the box
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      window.location.href = PAYMENT_LINK;
    };
  }

  // Handle the "Cancel" button inside the box
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      confirmationUI.style.display = 'none';
      standardActions.style.display = 'block';
    };
  }
}