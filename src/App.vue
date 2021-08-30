<template>
  <div id="app" class="container mx-auto p-10">
    <h1 class="text-center text-4xl">{{ title }}</h1>
    <p class="text-center">{{ msg }}</p>

    <div class="col">
      <div role="alert" v-show="error" @click="error = !error">
        <div class="bg-red-500 text-white font-bold rounded-t px-4 py-2">
          Error:
        </div>
        <div class="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
          <p>Please add the task name first!</p>
        </div>
      </div>

      <form @submit.prevent="addTask">
        <div class="input-group mb-3">

          <div class="flex justify-center items-center p-10 text-indigo-500">
              <div class="relative">
                  <input v-model="taskName" type="text" class="shadow-md h-14 w-96 pl-10 pr-20 rounded-lg z-0 focus:shadow focus:outline-none" placeholder="new Task">
                  <div class="absolute top-2 right-2 h-14"> 
                    <button v-if="update" class="h-10 w-10 text-white rounded-lg bg-yellow-500 hover:bg-yellow-600">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="edit" class="ml-1 w-8 h-8 svg-inline--fa fa-edit fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M402.6 83.2l90.2 90.2c3.8 3.8 3.8 10 0 13.8L274.4 405.6l-92.8 10.3c-12.4 1.4-22.9-9.1-21.5-21.5l10.3-92.8L388.8 83.2c3.8-3.8 10-3.8 13.8 0zm162-22.9l-48.8-48.8c-15.2-15.2-39.9-15.2-55.2 0l-35.4 35.4c-3.8 3.8-3.8 10 0 13.8l90.2 90.2c3.8 3.8 10 3.8 13.8 0l35.4-35.4c15.2-15.3 15.2-40 0-55.2zM384 346.2V448H64V128h229.8c3.2 0 6.2-1.3 8.5-3.5l40-40c7.6-7.6 2.2-20.5-8.5-20.5H48C21.5 64 0 85.5 0 112v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V306.2c0-10.7-12.9-16-20.5-8.5l-40 40c-2.2 2.3-3.5 5.3-3.5 8.5z"></path></svg>                    
                    </button>
                    <button v-else class="h-10 w-10 text-white rounded-lg bg-green-500 hover:bg-green-600">
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="plus" class="h-10 w-10 svg-inline--fa fa-plus fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg>
                    </button> 
                  </div>
              </div>
          </div>

        </div>
      </form>

      <div class="relative h-10 mr-1">
        <button v-if="deleteMultiple" class=" px-3 py-2 text-white rounded-lg bg-red-500 hover:bg-red-600 absolute inset-y-0 right-0 " @click="deleteMulti">
          <div class="">
            <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="trash" class="h-5 w-5 svg-inline--fa fa-trash fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"></path></svg>
          </div>
        </button>
      </div>


      <draggable v-model="tasks" @start="drag=true" @end="drag=false" class="w-full rounded-lg mt-2 mb-3 text-blue-800" @change="orderUpdate">
        
                <li v-for="(task_name,index) in tasks" :key="index" class="flex justify-between p-3  bg-gray-100 hover:bg-gray-200 rounded-lg mb-1 cursor-pointer">
                  <span @click="loadData(index)" class="w-full">
                    <span class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-indigo-600 rounded-full">{{task_name['order']}}</span>
                    {{ task_name['task'] }}</span>
                  <label class="inline-flex items-center">
                      <input :checked="task_name['check']" @change="changeCheck" :id="index" type="checkbox" class="form-checkbox h-8 w-8 text-green-600" >                      
                  </label>            
              </li>
        
      </draggable>

    </div>
    <div class="flex absolute right-0 top-0">      
      <img class="w-10 h-10 p-2 " src="./assets/logo.png">
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import axios from 'axios'

export default {  
  name: 'app',
  components: {
    draggable
  },
  data () {
    return {      
      title: 'MyDoList',
      msg: 'Welcome to the simple ToDo List App with Vue.js',
      taskName: "",
      // taskIndexName: 'id', //@todo make dynamic varNames
      tasks: [], // example [{"id": 0, "task": 'Test', "check": false, order: 1},],
      error: false,
      update: false,
      updateIndex: 0,
      ids: [],
      deleteMultiple: false
    }
  },
  updated: function(){
    console.log("UPDATED----");
    this.tasks.forEach((task) => {
      console.log(task.task,  "--", task.check);
    });
    console.log("----");
  },

  methods: {
    orderUpdate() {      
      this.tasks = this.tasks.map(function(task, index) {
        task.order = index + 1;
        return task
      })     
      
      // axios
      axios.post('http://127.0.0.1:8000/api/taskorders/', {tasks: this.tasks})
        .then(response => {
          console.log('res', response)          
        })
        .catch((error) => {
          console.warn(error);
        })
    },  

    deleteMulti: function(){ // eslint-disable-line no-unused-vars
      this.tasks.forEach((task) => {
        console.log(task.task, task.check);
      });
      console.log("----");
      var ids = [];
      this.tasks.forEach((task) => {
        if(task.check === true){
          ids.push(task.id)
        }
      });
      console.log('ids for Delete' , ids)
      ids.forEach(id => {
        this.tasks = this.tasks.filter(function(task) {          
          return task['id'] != id;
        });
      });
      console.log(ids);      
      this.deleteMultiple = false;
      this.tasks.forEach((task) => {
        console.log("DELETE:", task.task, task.check);
      });
      
      axios.post('http://127.0.0.1:8000/api/deletetaskorders', ids)
        .then(response => {
          console.log('res', response)
          this.getData()
        })
        .catch((error) => {
          console.warn(error);
        })      

    },

    // good
    changeCheck: function(e){      
      this.tasks[e.target.id]['check'] = e.target.checked
      var count = 0
      this.tasks.forEach((task) => {
        if(task.check == true){
          count = count + 1
        }
      })
      console.log('####',count)
      this.deleteMultiple = (count > 0) ? true : false
      console.log("changeCheck");
      this.tasks.forEach((task) => {
        console.log('->',task.task, task.check);
      });
    },

    loadData: function(index){
      console.log(this.tasks)
      this.taskName = this.tasks[index]['task']
      this.updateIndex = index
      this.update=true
    },

    addTask: function(){
      if(this.update == true){

        this.update = false
        this.tasks[this.updateIndex]['task'] = this.taskName
        axios.put('http://127.0.0.1:8000/api/tasks/' + this.tasks[this.updateIndex].id, this.tasks[this.updateIndex])
          .then(response => {
            console.log('res', response)
            this.getData()
          })
          .catch((error) => {
            console.warn(error);
          })        
      }
      else{
        var theIndex = (this.tasks.length+1);
        console.log('theIndex', theIndex, ' length:', this.tasks.length)
        if(this.taskName != ''){
          let data = {                
                "task": this.taskName,
                "check": false,
                "order": theIndex,
              }
          axios.post('http://127.0.0.1:8000/api/tasks/', data)
            .then(response => {
              console.log('res', response)
              this.getData()
            })
            .catch((error) => {
              console.warn(error);
            })

          //this.tasks.push({
          //  "id": theIndex,
          //  "task": this.taskName,
          //  "check": false
          //  })
        }
        else{
          this.error = true
          setTimeout(() => {            
            this.error = false
          }, 3000)
        }

      }

      this.taskName = ''
    },
    getData() {      
      axios
        .get('http://127.0.0.1:8000/api/tasks/')
        .then(response => {          
          console.log('res', response.data)
          this.tasks = response.data       
          var count = 0   
          this.tasks.forEach((task) => {
            if(task.check == true){
              count = count + 1
            }
          })
          console.log('####',count)
          this.deleteMultiple = (count > 0) ? true : false            
        })
        .catch((error) => {
          console.warn(error);
        })
    }
  },
  mounted() {
    this.getData()  
  }
}
</script>

<style>
</style>
