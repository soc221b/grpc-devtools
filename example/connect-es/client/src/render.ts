export const mountForm = (props: { onSubmit: (message: string) => void }) => {
  const formElement = document.createElement("form");
  formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    if (inputElement.value) {
      props.onSubmit(inputElement.value);
      inputElement.value = "";
    }
  });

  const inputElement = document.createElement("input");
  formElement.appendChild(inputElement);
  inputElement.autofocus = true;
  inputElement.placeholder = 'Type something... (type "leave" to leave room)';

  document.body.appendChild(formElement);
};

export const mountMessages = (props: { messages: string[] }) => {
  const ulElement = document.createElement("ul");

  props.messages.forEach((message) => {
    const item = document.createElement("li");
    item.textContent = message;
    ulElement.appendChild(item);
  });

  document.body.appendChild(ulElement);

  window.scrollTo(0, document.body.scrollHeight);
};

export const unmountMessages = () => {
  const oldMessageElement = document.body.querySelector("ul");
  oldMessageElement && document.body.removeChild(oldMessageElement);
};
