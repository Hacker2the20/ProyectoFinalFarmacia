

let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url= 'http://localhost:8000';

 describe('Como administrador quiero poder ingresar usuarios ',()=>{

	it('PASS', (done) => {
		chai.request(url)
			.post('/country')
			.send({id:0, user: "Victor", password: 12345, days: 10})
			.end( function(err,res){
				console.log(res.body)
				expect(res).to.have.status(200);
				done();
			});
	});
});

//Insertar Pais con error

describe('Como administrador quiero que me de arroge error al poner mal el usuario: ',()=>{

	it('PASS', (done) => {
		chai.request(url)
			.post('/country')
			.send({id:1, country: "Madrid", year: 2010, days: 10})
			.end( function(err,res){
				console.log(res.body)
				expect(res).to.have.status(500);
				done();
			});
	});

});


//Mostrar Todos los Paises
describe('como administrador quiero ver todos los Usuarios: ',()=>{

	it('PASS', (done) => {
		chai.request(url)
			.get('/countries')
			.end( function(err,res){
				//console.log(res.body)
				expect(res).to.have.status(200);
				done();
			});
	});

});


/////////////////Mostrar Pais por ID//////////////////////////////////
describe('como administrador quiero ver un usuario por id: ',()=>{

	it('should get the country with id 1', (done) => {
		chai.request(url)
			.get('/country/1')
			.end( function(err,res){
				//console.log(res.body)
				expect(res.body).to.have.property('id').to.be.equal(1);
				expect(res).to.have.status(200);
				done();
			});
	});

});
/////////////////Actualizar Usuario por ID//////////////////////////////////
describe('Como administrador quiero actualizar usuario por ID: ',()=>{

	it('should update the number of days', (done) => {
		chai.request(url)
			.put('/country/1/days/20')
			.end( function(err,res){
				//console.log(res.body)
				expect(res.body).to.have.property('days').to.be.equal(20);
				expect(res).to.have.status(200);
				done();
			});
	});

});
/////////////////Eliminar pais por ID//////////////////////////////////
describe('Como administrador quiero eliminar usuario por ID: ',()=>{

	it('should delete the country with id 1', (done) => {
		chai.request(url)
			.get('/countries')
			.end( function(err,res){
				//console.log(res.body)
				expect(res.body).to.have.lengthOf(2);
				expect(res).to.have.status(200);
				chai.request(url)
					.del('/country/1')
					.end( function(err,res){
						//console.log(res.body)
						expect(res).to.have.status(200);
						chai.request(url)
							.get('/countries')
							.end( function(err,res){
								//console.log(res.body)
								expect(res.body).to.have.lengthOf(1);
								expect(res.body[0]).to.have.property('id').to.be.equal(0);
								expect(res).to.have.status(200);
								done();
						});
					});
			});
	});

});
/////////////////Insertar pais por ID//////////////////////////////////
describe('Como administrador quiero Insertar pais por ID: ',()=>{

	it('should recieve an error because we send the country in form format', (done) => {
		chai.request(url)
			.post('/country')
			.type('form')
			.send({id:0, country: "Croacia", year: 2017, days: 10})
			.end( function(err,res){
				//console.log(res.body)
				expect(res).to.have.status(500);
				done();
			});
	});
});

// El `agente` ahora tiene la cookie de sesión guardada y la enviará
// volver al servidor en la siguiente solicitud
var agent = chai.request.agent(url)
describe('Autentificacion de Usuario: ',()=>{

	it('should receive an OK and a cookie with the authentication token', (done) => {
		agent
			.get('/authentication')
  			.auth('user', 'password')
			.end( function(err,res){
				console.log(res.body)
				expect(res).to.have.cookie('authToken');
				expect(res).to.have.status(200);
				return agent.get('/personalData/user')
      			.then(function (res) {
         			expect(res).to.have.status(200);
         			console.log(res.body)
         			done();
      			});
				done();
			});
	});

});

describe('Obtain personal data without authToken: ',()=>{

	it('should receive an error because we need authToken', (done) => {
		agent
			.get('/personalData/user')
      		.then(function (res) {
         		expect(res).to.have.status(500);
         		console.log(res.body)
      	});
		done();
	});

});
