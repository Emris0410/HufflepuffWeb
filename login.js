fetch('./Hufflepuffweb/Json/2x73u4r9k_users.data')
  .then(response => response.json())
  .then(users => {
    document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault();

      const inputUsername = document.getElementById('username').value.trim();
      const inputPassword = document.getElementById('password').value.trim();

      // Hàm giải mã Base64
      function decodeBase64(str) {
        try {
          return atob(str);
        } catch (e) {
          return '';
        }
      }

      // Kiểm tra user
      const user = users.find(u => 
        u.username === inputUsername && 
        decodeBase64(u.password) === inputPassword
      );

      if (user) {
        window.location.href = user.redirect;
      } else {
        document.getElementById('message').textContent = "Sai tên đăng nhập hoặc mật khẩu!";
      }
    });
  })
  .catch(error => {
    console.error('Lỗi tải dữ liệu người dùng:', error);
    document.getElementById('message').textContent = "Lỗi tải dữ liệu.";
  });
