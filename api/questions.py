import json
from bottle import route, request, abort
import MySQLdb
import config

db = MySQLdb.connect(host=config.DB["HOST"], user=config.DB["USER"], passwd=config.DB["PASSWORD"], db=config.DB["NAME"])

@route('/questions', method='GET')
def get_questions():
    cursor = db.cursor()
    cursor.execute("select `id`, `text` from `questions`")
    rows = [{"id": row[0], "text": row[1]} for row in cursor.fetchall() ]
    cursor.close()
    return json.dumps(rows)

@route('/questions', method='POST')
def add_question():
    text = request.json['text']
    cursor = db.cursor()
    cursor.execute("insert into `questions` (`text`) values (%(text)s)", {'text': text})
    id = db.insert_id()
    cursor.close()
    db.commit()
    return json.dumps({"id": id, "text": text})

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

@route('/submit_answers', method='POST')
def submit_answers():
    answers = request.json["answers"]
    cursor = db.cursor()
    for answer in answers:
        cursor.execute("insert into `answers` (`question`, `text`) values (%(answer)s, %(text)s)", {'answer': answer["id"], 'text': answer["text"]})
    cursor.close()
    db.commit()
    return ""
