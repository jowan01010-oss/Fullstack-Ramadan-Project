import helpers
from google import genai
from config import GEMINI_API_KEY
import json

def create_todo(description):
    
    prompt = """Create a new todo item based on the following description. Provide a concise title and an optional detailed description. The todo should be actionable and clear.
    Description: {description}
    Format your response as a JSON object with the following structure:
{{
    "title": "A concise title for the todo",
    "description": "A summary description of the todo",
    "tag": "One word tag (e.g., personal, urgent, community, religious)",
    "summary": ["A list of points summary of the todo"],
    "date": "A formatted date string like 'Mar 10 2026', if date not mentioned in the description, make it today's date",
    "variant": "wide if more detailed, or small",
    "volunteersNeeded": "Number of volunteers needed to complete the task as an integer",
    "priority": "An integer from 1 to 5, with 5 being the highest priority"
}}

For example, this is two different descriptions and the expected output:
Description: "Organize a community clean-up event at the local park next Saturday. We need volunteers to help with picking up trash, setting up stations for recycling, and providing refreshments. The event will run from 9 AM to 1 PM. We also need someone to create flyers and promote the event on social media."
Expected Output:
{{
    "title": "Community Clean-Up Event",
    "description": "Organize a clean-up event at the local park next Saturday...",
    "tag": "community",
    "summary": ["Organize a clean-up event at the local park", "Date: Next Saturday"],
    "date": "Mar 15 2026",
    "variant": "wide",
    "volunteersNeeded": 10,
    "priority": 4
}}

notice we are in {current_time}, so the date should be generated accordingly if not mentioned in the description."""
    
    client = genai.Client(api_key=GEMINI_API_KEY)
    try:
        response = client.models.generate_content(
            model='gemini-3-flash-preview',
            contents=prompt.format(description=description, current_time=helpers.get_current_date_formatted()),
        )
        content = helpers.clean_gemini_response(response.text)
        new_todo = json.loads(content)
    except Exception as e:
        return {'error': f'Failed to generate todo: {str(e)}'}

    new_todo['id'] = helpers.get_next_id()
    new_todo['completed'] = False
    new_todo['completedOn'] = None 

    tasks = helpers.read_db_file()
    tasks.append(new_todo)
    helpers.write_db_file(tasks)
    return new_todo

def get_todo_by_id(todo_id):
    tasks = helpers.read_db_file()
    for task in tasks:
        if task['id'] == todo_id:
            return task
    return None

def update_todo(todo_id, update_data):
    task = get_todo_by_id(todo_id)
    if not task: return None
    
    tasks = helpers.read_db_file()
    tasks.remove(task)

    
    fields = ["title", "description", "date", "variant", "volunteersNeeded", "priority", "completed", "completedOn", "tag"]
    for field in fields:
        if field in update_data:
            task[field] = update_data[field]
    
    tasks.append(task)
    helpers.write_db_file(tasks)
    return task

def delete_todo(todo_id):
    task = get_todo_by_id(todo_id)
    if task:
        tasks = helpers.read_db_file()
        tasks.remove(task)
        helpers.write_db_file(tasks)