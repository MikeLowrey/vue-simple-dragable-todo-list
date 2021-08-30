# Vue simple dragable ToDo List

## Project setup
## Frontend
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Backend
Create a Laravel Project 
```
composer create-project laravel/laravel
```

Open your .env file and add your database Connection.
For this simple try I recommended to use SQLITE.

```
DB_CONNECTION=sqlite
```

Now execute the following commands one after the other:
```
php artisan make:model Task -m
php artisan make:controller Api/TaskController --resource
php artisan make:factory TaskFactory --model=Task
```
Open you api.php file and add:
```
Route::resource('tasks', App\Http\Controllers\Api\TaskController::class);
Route::post('taskorders', [App\Http\Controllers\Api\TaskController::class, 'changeTaskOrders']);
Route::post('deletetaskorders', [App\Http\Controllers\Api\TaskController::class, 'deleteTaskOrders']);
```

Open your Task Model (Task.php) and edit:
```
    protected $fillable = ['check', 'task', 'order'];

    protected $casts = [
        'check' => 'boolean',
    ];
```

Open your TaskController (Api/TaskController.php) and change to:
```
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Task::orderBy('order')->get();
        return TaskResource::collection(Task::all());
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        return Task::create($request->input());
    }

    public function changeTaskOrders(Request $request) 
    {   
        return array_map(function($item) {
            $task = Task::findOrFail($item['id']);
            if ($task->order != $item['order']) {
                return $task->update($item);
            }
        }, $request->input('tasks'));
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        $task->update($request->input());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        return $task->delete();
    }

    public function deleteTaskOrders(Request $request) 
    {
        return array_map(function($id) {
            $task = Task::findOrFail($id);
            return [$id => $task->delete()];
        }, $request->input());
    }
}
```

Open your tsak migration file and change your run method to:
```
    public function up()
    {
        Schema::create('tasks', function (Blueprint $table) {

            $table->id();
            $table->string('task')->nullable();
            $table->boolean('check')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }
```


Last but not least open your Task Factory file and add this view lines of code to the definition method:
```
    public function definition()
    {
        $nbWords = $this->faker->numberBetween(1,8);
        $title = $this->faker->sentence($nbWords);
        return [            
            'task' => $title,
            'check' => (bool)random_int(0, 1),
        ];
    }
```

**Now you migrate and seed the data to your database**
```
php artisan migrate
php artisan db:seed
```