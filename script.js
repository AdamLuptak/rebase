document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("contactForm");

function setError(name, msg){
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if(el) el.textContent = msg || "";
}
function isEmail(v){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  let ok = true;
  setError("name","");
  setError("email","");
  setError("message","");

  if(name.length < 2){ setError("name","Please enter your name."); ok = false; }
  if(!isEmail(email)){ setError("email","Please enter a valid email."); ok = false; }
  if(message.length < 10){ setError("message","Please write at least 10 characters."); ok = false; }
  if(!ok) return;

  const subject = encodeURIComponent("REBASE website inquiry");
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:info@rebase.eu.com?subject=${subject}&body=${body}`;
});
