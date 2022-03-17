//유저가 값을 입력한다
// + 버튼 클릭 하면 할일 추가
// delete 버튼 클릭 시 할일이 삭제 된다.

// check 버튼 클릭 시 할일 이 끝나면서 밑줄
// 1. check 버튼 클릭 하는 순간 true false
// 2. true 이면 끝난걸로 간주하고 밑줄
// 3. false 면 안끝난걸로 간주하고 그대로

// 진행중 끝남 탭을 누르면, 언더바 이동
// 끝남 탭은, 끝난 아이템만, 진행중 탭은 진행중인 아이템만 나온다
// 전체 탭을 누르면 다시 전체 아이템으로 돌아옴

// How to add enter event javascript

let input = document.querySelector(".input-area input");
let addButton = document.querySelector(".input-area button");
let tabs = document.querySelectorAll('.task-tabs div');
let taskList = [];
let taskBox = document.querySelector(".task-box");
let mode = 'all';
let filterList = [];

addButton.addEventListener("click", inputClick);

tabs.forEach((i,v)=>{
    tabs[v].addEventListener('click' , function(e){filter(e)})
})

function inputClick() {
  let task = {
    id: randomIDGenerate(),
    taskContent: input.value,
    isComplete: false,
  };
  taskList.push(task);
  console.log(taskList);
  render();
}

function render() {
    let list = [];
    if(mode == 'all'){
        list = taskList;
    } else if(mode =='onGoing' || mode == 'done'){
        list = filterList
    }


  let resultHTML = "";
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML += `
        <div class="task task-done">
        <span>${list[i].taskContent}</span>
        <div class="button-box">
            <button onClick="toggleComplete('${list[i].id}')"><i class="fa fa-bookmark"></i></button>
            <button onClick="deleteTask('${list[i].id}')"><i class="fa fa-trash"></i></button>
        </div>
    </div>`;
    } else {
      resultHTML += `
        <div class="task">
        <span>${list[i].taskContent}</span>
        <div class="button-box">
            <button onClick="toggleComplete('${list[i].id}')"><i class="far fa-bookmark"></i></button>
            <button onClick="deleteTask('${list[i].id}')"><i class="fa fa-trash"></i></button>
        </div>
    </div>`;
    }
  }

  taskBox.innerHTML = resultHTML;
}

function toggleComplete(id) {
  //console.log("id :", id);
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  render();
}

function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList.splice(i, 1);
      break;
    }
  }
  render();
}

function filter(e){
    mode = e.target.id
    filterList = [];

    if(mode == 'all'){
        render()
    } else if( mode == 'onGoing'){
        for(let i = 0; i < taskList.length; i++){
            if(taskList[i].isComplete == false){
                filterList.push(taskList[i]);
            }
        }
        render()
    } else if( mode == 'done'){
        for(let i = 0; i < taskList.length; i++){
            if(taskList[i].isComplete == true){
                filterList.push(taskList[i]);
            }
        }
        render()
    }
}




function randomIDGenerate() {
  return "_" + Math.random().toString(36).substring(2, 9);
}