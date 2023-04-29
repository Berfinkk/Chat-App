const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors()); //app uygulaması cors modülünün sağladığı işlevi kullanarak cors desteği sağlamak için konfigüre edilir

const server = http.createServer(app);//http sunucusu oluşturulur ve app uygulaması bu sunucu ile birleştirilir

const io = new Server(server, {//socket.io sunucusu oluşturmak için new Server() fonksiyonu kullanılır
  cors: {//cors özellikleri sunucuya cors desteği sağlmak için yapılandırılır
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
//GET yöntemi, bir sunucudan belirli bir kaynağın (resource) belirtilen URL'sini (Uniform Resource Locator) istemek için kullanılır. Bu istek genellikle URL'deki parametrelerle birlikte gönderilir ve sunucu, belirtilen kaynağı ve istenen bilgileri içeren bir yanıt (response) gönderir.
//POST yöntemi, bir formun sunucuya gönderilmesi için kullanılır. Bu yöntem, formdaki verileri sunucuya gönderir ve sunucu, bu verileri işleyerek istenen yanıtı oluşturur.

io.on("connection", (socket) => { // Bu kod, io nesnesinin connection olayını dinler. Bir bağlantı oluşturulduğunda, socket adlı bir nesne oluşturulur ve geri çağrı işlevi çalıştırılır. Bu geri çağrı işlevi, kullanıcının kimliğini konsola yazdırır.
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);// Bu kod, socket nesnesinin disconnect olayını dinler. Kullanıcı bağlantısı kesildiğinde, konsola "Kullanıcı bağlantısı kesildi" ve kullanıcının kimliği yazdırılır.
  });
});

server.listen(3001, () => {//sunucunun belirtilen portta dinlenilmesini başlatır
  console.log("SERVER RUNNING");
});