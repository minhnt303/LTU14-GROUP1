
    const server = express();
    // const io = require('socket.io')(http)
    server.use(express.static('public'));
    server.use(bodyParser.urlencoded({ extended: false }));
    server.use(bodyParser.json());
    server.get("/", (req, res) => {
        res.status(200).sendFile(path.resolve(__dirname + "/mapboxtest.html"));
    });
