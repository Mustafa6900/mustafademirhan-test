/**
 * FAQ Section JavaScript
 * Handles accordion functionality for FAQ items
 */

class FAQSection {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const questionButtons = document.querySelectorAll('.faq-item__question');
    
    questionButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const faqItem = e.currentTarget.closest('.faq-item');
        this.toggleFAQ(faqItem);
      });
      button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const faqItem = e.currentTarget.closest('.faq-item');
          this.toggleFAQ(faqItem);
        }
      });
    });
  }

  toggleFAQ(faqItem) {
    if (!faqItem) return;

    const questionButton = faqItem.querySelector('.faq-item__question');
    const answer = faqItem.querySelector('.faq-item__answer');
    const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';

    if (!isExpanded) {
      this.closeAllFAQs();
      this.openFAQ(questionButton, answer);
    } else {
      this.closeFAQ(questionButton, answer);
    }
  }

  openFAQ(questionButton, answer) {
    questionButton.setAttribute('aria-expanded', 'true');
    answer.classList.add('show');
    
    this.scrollToAnswer(answer);
  }

  closeFAQ(questionButton, answer) {
    questionButton.setAttribute('aria-expanded', 'false');
    answer.classList.remove('show');
  }

  closeAllFAQs() {
    const allQuestions = document.querySelectorAll('.faq-item__question');
    const allAnswers = document.querySelectorAll('.faq-item__answer');

    allQuestions.forEach(question => {
      question.setAttribute('aria-expanded', 'false');
    });

    allAnswers.forEach(answer => {
      answer.classList.remove('show');
    });
  }

  scrollToAnswer(answer) {
    const rect = answer.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (!isVisible) {
      answer.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new FAQSection();
});

document.addEventListener('shopify:section:load', (event) => {
  if (event.target.classList.contains('faq-section')) {
    new FAQSection();
  }
});
