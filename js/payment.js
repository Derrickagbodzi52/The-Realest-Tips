// Simple payment helper — replace PAYMENT_LINK with your Stripe Payment Link URL
export let PAYMENT_LINK = "https://paystack.shop/pay/0gu44fw2h-";

export function setPaymentLink(url) {
  PAYMENT_LINK = url;
}

export function initPayment(buttonSelector) {
  const btn = document.querySelector(buttonSelector);
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!PAYMENT_LINK || PAYMENT_LINK.includes('REPLACE_WITH')) {
      alert('Payment is not configured. Open js/payment.js and set your Stripe Payment Link URL.');
      return;
    }

    const modal = createConfirmationModal({
      title: 'Proceed to payment',
      message: 'You will be redirected to the payment page to complete your subscription. Continue?',
      confirmText: 'Proceed',
      cancelText: 'Cancel',
      onConfirm() {
        window.location.href = PAYMENT_LINK;
      }
    });

    document.body.appendChild(modal);
  });
}

function createConfirmationModal({ title = 'Confirm', message = '', confirmText = 'OK', cancelText = 'Cancel', onConfirm }) {
  const overlay = document.createElement('div');
  overlay.className = 'payment-modal-overlay';

  const box = document.createElement('div');
  box.className = 'payment-modal-box';

  const h = document.createElement('h3');
  h.textContent = title;

  const p = document.createElement('p');
  p.textContent = message;

  const actions = document.createElement('div');
  actions.className = 'payment-modal-actions';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'payment-modal-cancel';
  cancelBtn.textContent = cancelText;
  cancelBtn.addEventListener('click', () => overlay.remove());

  const confirmBtn = document.createElement('button');
  confirmBtn.className = 'payment-modal-confirm';
  confirmBtn.textContent = confirmText;
  confirmBtn.addEventListener('click', () => { if (typeof onConfirm === 'function') onConfirm(); overlay.remove(); });

  actions.appendChild(cancelBtn);
  actions.appendChild(confirmBtn);

  box.appendChild(h);
  box.appendChild(p);
  box.appendChild(actions);
  overlay.appendChild(box);

  return overlay;
}

// Example: in the console you can run:
// import { setPaymentLink } from './js/payment.js'; setPaymentLink('https://buy.stripe.com/xyz');
