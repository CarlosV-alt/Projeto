from flask_sqlalchemy import SQLAlchemy
from datetime import date

db = SQLAlchemy()

class Cidadao(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)
    data_nascimento = db.Column(db.Date, nullable=False)
    sexo = db.Column(db.String(1), nullable=False)  # M/F/O

class Profissional(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    funcao = db.Column(db.String(50), nullable=False)
    setor = db.Column(db.String(50), nullable=False)

class Atendimento(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime, nullable=False)
    tipo = db.Column(db.String(20), nullable=False)
    descricao = db.Column(db.Text, nullable=False)
    cidadao_id = db.Column(db.Integer, db.ForeignKey('cidadao.id'), nullable=False)
    profissional_id = db.Column(db.Integer, db.ForeignKey('profissional.id'), nullable=False)
    
    cidadao = db.relationship('Cidadao', backref='atendimentos')
    profissional = db.relationship('Profissional', backref='atendimentos')