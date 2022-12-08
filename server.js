

const restify = require('restify');
var CookieParser = require('restify-cookies');

const server = restify.createServer();

server.get('/', function(req, res) {  
   res.send("Pagina Funcionando");
}); 


server.use(restify.CORS());

const user={id: 0,country:"victor",year:2022,days:21};

//const usuario={id: 0,user:"user",name:"Cachimiro",age:"28"};

var countries = [user];

let lastId=0;



server.use(restify.jsonBodyParser({ mapParams: true }))
server.use(CookieParser.parse);

server.post('/country',(req,res,next)=>{
	const body=req.body;
	console.log("---------------------------");
	console.log(body);
	console.log("---------------------------");
	if(body.country==='Madrid'){
		res.send(500,'Usuario ingresado no es correcto');
	}else if((JSON.stringify(body)).includes('&')){
		res.send(500,'Elemento viene como un formulario. Solo se admite JSON');
	}else{
		body.id=++lastId;
		countries.push(body);
		res.send(200,'Se agreso un usuario');
	}
	next();
});

server.get('/countries',(req,res,next)=>{
	
	res.send(200,countries);
	next();
});

server.get('/country/:id',(req,res,next)=>{
	var id=req.params.id;

	res.send(200,countries[id]);
	next();
});

server.del('/country/:id',(req,res,next)=>{
	var id=req.params.id;
	//delete countries[id];
	countries.splice(id,1);
	res.send(200,'Elemento eliminado');
	next();
});

server.put('/country/:id/days/:days',(req,res,next)=>{
	var id=req.params.id;
	var days=parseInt(req.params.days);
	var data=countries[id];
	data.days=days;
	countries.splice(id,1,data);
	console.log(countries);
	res.send(200,data);
	next();
});

server.get('/authentication',(req,res,next)=>{
	const body=req.body;
	console.log(req.authorization);
	res.setCookie('authToken','Token');
	res.send(200,"El usuario se encuentra en la BBDD");
	next();
});

server.get('/personalData/:user',(req,res,next)=>{
	var user=req.params;
	var cookies=req.cookies;
	console.log(user);
	console.log(cookies);
	if(cookies.authToken==="Token"){
		res.send(200,usuario);
	}else{
		res.send(500,"Se necesita el token de autenticación");
	}
	next();
});

///notes/:id--> req.params.id
server.listen(8000, function() {
    console.log("Node server running on http://localhost:8000");
  });
