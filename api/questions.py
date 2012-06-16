import json
from bottle import route, request, abort
import MySQLdb
import config

db = MySQLdb.connect(host=config.DB["HOST"], user=config.DB["USER"], passwd=config.DB["PASSWORD"], db=config.DB["NAME"])

# questions REST functions
@route('/questions', method='GET')
def get_questions():
    project = request.query.project
    cursor = db.cursor()
    cursor.execute("select `id`, `project`, `text` from `questions` where `project`=%(project)s", {'project': project})
    rows = [{"id": row[0], "project": row[1], "text": row[2]} for row in cursor.fetchall() ]
    cursor.close()
    return json.dumps(rows)

@route('/questions', method='POST')
def add_question():
    text = request.json['text']
    project = request.json['project']
    cursor = db.cursor()
    cursor.execute("insert into `questions` (`text`, `project`) values (%(text)s, %(project)s)", {'text': text, 'project': project})
    id = db.insert_id()
    cursor.close()
    db.commit()
    return json.dumps({"id": id, "text": text, 'project': project})

@route('/questions/:id', method='DELETE')
def delete_question(id):
    cursor = db.cursor()
    cursor.execute("delete from `questions` where `id`=%(id)s", {'id': id})
    cursor.close()
    db.commit()
    return ""

@route('/questions/:id', method='PUT')
def update_question(id):
    text = request.json['text']
    cursor = db.cursor()
    cursor.execute("update `questions` set `text`=%(text)s where `id`=%(id)s", {'text': text, 'id': id})
    cursor.close()
    db.commit()
    return json.dumps({"id": id, "text": text})

# answers REST functions
@route('/answers', method='GET')
def get_answers():
    project = request.query.project
    user = request.query.user
    cursor = db.cursor()
    cursor.execute("select `answers`.`id`, `answers`.`question`, `answers`.`text`, `questions`.`text` as `question_text` from `answers`, `questions` where `answers`.`question`=`questions`.`id` and `questions`.`project`=%(project)s and `answers`.`user`=%(user)s", {'project': project, 'user': user})
    rows = [{"id": row[0], "question": row[1], "text": row[2], 'question_text': row[3]} for row in cursor.fetchall() ]
    cursor.close()
    return json.dumps(rows)

@route('/answers', method='POST')
def add_answer():
    if 'text' in request.json:
        text = request.json['text']
    else:
        text = ''
    question = request.json['question']
    question_text = request.json['question_text']
    user = request.json['user']
    cursor = db.cursor()
    cursor.execute("insert into `answers` (`text`, `question`, `user`) values (%(text)s, %(question)s, %(user)s)", {'text': text, 'question': question, 'user': user})
    id = db.insert_id()
    cursor.close()
    db.commit()
    return json.dumps({"id": id, "text": text, 'question': question, 'question_text': question_text, 'user': user})

@route('/answers/:id', method='DELETE')
def delete_answer(id):
    cursor = db.cursor()
    cursor.execute("delete from `answers` where `id`=%(id)s", {'id': id})
    cursor.close()
    db.commit()
    return ""

@route('/answers/:id', method='PUT')
def update_answer(id):
    text = request.json['text']
    cursor = db.cursor()
    cursor.execute("update `answers` set `text`=%(text)s where `id`=%(id)s", {'text': text, 'id': id})
    cursor.close()
    db.commit()
    return json.dumps({"id": id, "text": text})
