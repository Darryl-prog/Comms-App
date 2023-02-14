class Validator {
  constructor() {
    this.email = document.getElementById('email');
    this.fullName = document.getElementById('fullname');
  }

  isValidFullName() {
    if (!this.fullName.value || !this.fullName.value.trim()) {
      alert('Please provide full name');
      return false;
    } else return true;
  }

  isValidEmail() {
    if (
      this.email.value.includes('@') && // Checks if email has '@' symbol
      this.email.value.split('@')[0] !== '' && //Checks if email has the local part (characters before '@' symbol)
      !this.email.value
        .slice(0, this.email.value.lastIndexOf('@'))
        .includes('@') && // Extract the local part of the email and checks if '@' symbol is included on it
      this.email.value.lastIndexOf('@') < this.email.value.lastIndexOf('.') && //Checks if the last appearing '.' symbol is after the '@' symbol
      !this.email.value
        .slice(
          this.email.value.indexOf('@') + 1,
          this.email.value.lastIndexOf('.'),
        )
        .includes('.') && //Checks if the domain name (ex. localpart@domainname.extension) includes ('.') symbol
      this.email.value.split('@')[1].split('.')[0] !== '' && //Checks if email has domain name
      this.email.value.length > this.email.value.lastIndexOf('.') + 2 //Checks if the email has the extension part, to be valid it should consist of two characters
    ) {
      return true;
    } else {
      alert('Please enter a valid email');
      return false;
    }
  }
}
