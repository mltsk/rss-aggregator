import onChange from 'on-change';
import i18next from 'i18next';

const renderFeedback = (feedback, elements) => {
  elements.feedback.textContent = i18next.t(feedback);
};

const renderFeedbackValidation = (isValid, elements) => {
  if (isValid) {
    elements.input.classList.remove('is-invalid');
    elements.feedback.classList.remove('text-danger');
    elements.feedback.classList.add('text-success');
  } else {
    elements.input.classList.add('is-invalid');
    elements.feedback.classList.add('text-danger');
    elements.feedback.classList.remove('text-success');
  }
};

const renderFeed = (feeds, elements) => {
  elements.feeds.innerHTML = '';
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0');
  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = 'Фиды';
  divCard.append(divCardBody);
  divCardBody.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  feeds.forEach((el) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = el.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = el.description;
    li.append(h3, p);
    ul.append(li);
  });

  divCard.append(ul);
  elements.feeds.append(divCard);
};

const renderPost = (posts, elements) => {
  elements.posts.innerHTML = '';
  const divCard = document.createElement('div');
  divCard.classList.add('card', 'border-0');
  const divCardBody = document.createElement('div');
  divCardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = 'Посты';
  divCard.append(divCardBody);
  divCardBody.append(h2);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  posts.forEach((el) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    if (el.status === 'unread') {
      a.classList.add('fw-bold');
    } else {
      a.classList.add('fw-normal');
    }
    a.textContent = el.title;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener', 'noreferrer');
    a.dataset.id = el.id;
    a.href = el.link;

    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = 'Просмотр';
    button.setAttribute('type', 'button');
    button.dataset.bsTarget = '#modal';
    button.dataset.bsToggle = 'modal';
    button.dataset.id = el.id;
    button.href = el.link;

    li.append(a, button);
    ul.append(li);
  });

  divCard.append(ul);
  elements.posts.append(divCard);

  document.querySelectorAll("[data-bs-target='#modal']").forEach((button) => {
    button.addEventListener('click', (event) => {
      const idTarget = event.target.dataset.id;
      const post = posts.find((item) => item.id === idTarget);
      post.status = 'read';
      document.querySelector(`a[data-id='${idTarget}']`).classList.remove('fw-bold');
      document.querySelector(`a[data-id='${idTarget}']`).classList.add('fw-normal');
      elements.modalTitle.textContent = post.title;
      elements.modalBody.textContent = post.description;
    });
  });
};

const renderButton = (status, elements) => {
  switch (status) {
    case 'loading':
      elements.button.setAttribute('disabled', true);
      break;
    case 'failed':
      elements.button.removeAttribute('disabled');
      break;
    case 'success':
      elements.button.removeAttribute('disabled');
      elements.form.reset();
      elements.input.focus();
      break;
    default:
      throw Error(`Unknown status: ${status}`);
  }
};

const initView = (state, elements) => {
  const mapping = {
    feeds: () => renderFeed(state.feeds, elements),
    posts: () => renderPost(state.posts, elements),
    'form.input.feedback': () => renderFeedback(state.form.input.feedback, elements),
    'form.input.isValid': () => renderFeedbackValidation(state.form.input.isValid, elements),
    'form.status': () => renderButton(state.form.status, elements),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });

  return watchedState;
};

export default initView;
