from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Cidadao, Profissional, Atendimento
from datetime import date, datetime

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db.init_app(app)

@app.route('/cidadaos', methods=['POST'])
def criar_cidadao():
    data = request.json
    try:
        novo_cidadao = Cidadao(
            nome=data['nome'],
            cpf=data['cpf'],
            data_nascimento=datetime.strptime(data['data_nascimento'], '%Y-%m-%d').date(),
            sexo=data['sexo']
        )
        db.session.add(novo_cidadao)
        db.session.commit()
        return jsonify({"id": novo_cidadao.id}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

@app.route('/cidadaos', methods=['GET'])
def listar_cidadaos():
    cidadaos = Cidadao.query.all()
    return jsonify([{
        "id": c.id,
        "nome": c.nome,
        "cpf": c.cpf,
        "data_nascimento": c.data_nascimento.isoformat(),
        "sexo": c.sexo
    } for c in cidadaos])

@app.route('/profissionais', methods=['POST'])
def criar_profissional():
    data = request.json
    novo_prof = Profissional(
        nome=data['nome'],
        funcao=data['funcao'],
        setor=data['setor']
    )
    db.session.add(novo_prof)
    db.session.commit()
    return jsonify({"id": novo_prof.id}), 201

@app.route('/profissionais', methods=['GET'])
def listar_profissionais():
    profissionais = Profissional.query.all()
    return jsonify([{
        "id": p.id,
        "nome": p.nome,
        "funcao": p.funcao,
        "setor": p.setor
    } for p in profissionais])

@app.route('/atendimentos', methods=['POST'])
def criar_atendimento():
    data = request.json
    try:
        novo_atendimento = Atendimento(
            data=datetime.strptime(data['data'], '%Y-%m-%dT%H:%M'),
            tipo=data['tipo'],
            descricao=data['descricao'],
            cidadao_id=data['cidadao_id'],
            profissional_id=data['profissional_id']
        )
        db.session.add(novo_atendimento)
        db.session.commit()
        return jsonify({"id": novo_atendimento.id}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 400

@app.route('/atendimentos', methods=['GET'])
def listar_atendimentos():
    atendimentos = Atendimento.query.join(Cidadao).join(Profissional).all()
    return jsonify([{
        "id": a.id,
        "data": a.data.isoformat(),
        "tipo": a.tipo,
        "descricao": a.descricao,
        "cidadao_id": a.cidadao_id,
        "cidadao": a.cidadao.nome,
        "profissional_id": a.profissional_id,
        "profissional": f"{a.profissional.nome} ({a.profissional.funcao})"
    } for a in atendimentos])
 
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=5000)