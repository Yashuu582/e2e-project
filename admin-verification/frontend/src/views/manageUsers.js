<!DOCTYPE html>
<html>
<head><title>Manage Users</title></head>
<body>
  <%- require("../components/Sidebar")() %>
  <h1>All Users</h1>
  <% users.forEach(user => { %>
    <div>
      <h3><%= user.name %></h3>
      <p>Email: <%= user.email %></p>
    </div>
    <hr/>
  <% }) %>
</body>
</html>
