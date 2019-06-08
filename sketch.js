function setup() {
  createCanvas(500, 400);
  frameRate(60);
}

function preload() { // tải ảnh lên
  img = loadImage('NGNL.jpg');
  lose = loadImage('lose.jpg');
  win = loadImage('win.jpg');
  instruct = loadImage('usoppno2.jpg');
}
class Map { // tạo bảng chơi
  constructor() { // thiết kế bảng chơi
    this.size = 8 + level;
    this.arr = [];
    this.visit = [];
    this.ansx = [];
    this.ansy = [];
    this.check = [];
    this.stepx = [];
    this.must = [];
    this.stepy = [];
    this.stepx.push(1);
    this.stepy.push(1);
    this.child = [];
    this.px = 1;
    this.py = 1;
    this.y = height / this.size;
    this.x = (width - 100) / this.size;
    for (let i = 0; i <= this.size + 1; i++) {
      this.arr[i] = [];
      this.visit[i] = [];
      this.check[i] = [];
      for (let j = 1; j <= this.size + 1; j++) {
        this.check[i][j] = 0;
        this.visit[i][j] = 0;
      }
    }
    this.check[1][1] = 1;
    this.arr[1][1] = 1;
    for (let i = 1; i <= this.size; i++) {
      for (let j = 1; j <= this.size; j++) {
        if (this.arr[i][j] == undefined) {
          this.arr[i][j] = int(random(1, 5));
        }
      }
    }
  }
  choose() { // chọn các ô bắt buộc phải đi qua
    for (let i = 1; i < this.ansx.length-1; i++) {
      this.must.push(i);
    }
    this.must = shuffle(this.must);
    for (let i = 0; i <= level; i++) {
      this.visit[this.ansx[this.must[i]]][this.ansy[this.must[i]]] = 2;
    }
  }
  display() { // vẽ bảng chơi
    push();
    strokeWeight(2);
    for (let i = 0; i <= this.size; i++) {
      line(this.x * i, 0, this.x * i, height);
    }
    for (let i = 0; i <= this.size; i++) {
      line(0, this.y * i, width - 100, this.y * i);
    }
    for (let i = 1; i <= this.size; i++) {
      for (let j = 1; j <= this.size; j++) {
        if (this.visit[i][j] == 2) {
          push();
          fill(100, 100, 0);
          square((i - 1) * this.x, (j - 1) * this.y, this.x);
          pop();
        }
        if (this.check[i][j] == 1) {
          push();
          fill(100, 100, 100);
          square((i - 1) * this.x, (j - 1) * this.y, this.x);
          pop();
        }
      }
    }
    for (let i = 1; i <= this.size; i++) {
      for (let j = 1; j <= this.size; j++) {
        push();
        textAlign(CENTER, CENTER);
        textSize(height / this.size - 10);
        if (this.arr[i][j] == 1) fill(grn);
        else if (this.arr[i][j] == 2) fill(rd);
        else if (this.arr[i][j] == 3) fill(yellow);
        else if (this.arr[i][j] == 4) fill(blu);
        text(this.arr[i][j], i * this.x - this.x / 2, j * this.y - this.y / 2 + 1);
        pop();
      }
    }
    pop();
  }
  isWin() { // kiểm tra xem người chơi đã thắng hay chưa
    if (this.px == this.size && this.py == this.size) {
      for (let i = 1; i <= this.size; i++) {
        for (let j = 1; j <= this.size; j++) {
          if (this.visit[i][j] == 2 && this.check[i][j] == 0) return false;
        }
      }
      return true;
    }
  }
  isLose() { // kiểm tra xem người chơi đã thua hay chưa
    if (task.time == 0) return true;
    for (let i = 0; i < 8; i++) {
      if (this.arr[this.px + dx[i]][this.py + dy[i]] == (this.arr[this.px][this.py] % 4) + 1) {
        if (this.check[this.px + dx[i]][this.py + dy[i]] == 0) {
          return false;
        }
      }
    }
    if (task.undo == 0) return true;
  }
}

function DFS(x, y) { // tìm đáp án
  if (x == mp.size && y == mp.size) {
    mp.ansx.push(x);
    mp.ansy.push(y);
    mp.arr[x][y] = count % 4;
    if (count % 4 == 0) mp.arr[x][y] = 4;
    ok = 1;
    return;
  }
  mp.visit[x][y] = 1;
  let newstep = shuffle(step);
  for (let i = 0; i < 8; i++) {
    if (ok == 1) {
      mp.ansx.push(x);
      mp.ansy.push(y);
      mp.arr[x][y] = count % 4;
      if (count % 4 == 0) mp.arr[x][y] = 4;
      return;
    }
    count++;
    x += directx[newstep[i]];
    y += directy[newstep[i]];
    if (x > 0 && y > 0 && x <= mp.size && y <= mp.size && mp.visit[x][y] == 0) {
      DFS(x, y);
    }
    count--;
    x -= directx[newstep[i]];
    y -= directy[newstep[i]];
  }
  if (ok == 1) {
    mp.ansx.push(x);
    mp.ansy.push(y);
    mp.arr[x][y] = count % 4;
    if (count % 4 == 0) mp.arr[x][y] = 4;
    return;
  }
}
class Taskbar { // khu vực hiển thị các nút bấm gì gì đó có điểm, nút undo vs đủ thứ khác mà e ko bt gọi là gì
  constructor() {
    this.score = 100;
    this.undo = 5;
    this.y = 50;
    this.x = 50;
    this.time = 60;
  }
  display() {
    push();
    line(400, 0, 500, 0);
    line(500, 0, 500, 400);
    line(400, 400, 500, 400);
    fill(200, 0, 200);
    textAlign(CENTER);
    textSize(30);
    text('Score', 450, 35);
    text('Time', 450, 235);
    text(this.score, 450, 85);
    text(this.undo, 450, 185);
    text(this.time, 450, 285);
    fill(200, 0, 0);
    textSize(25);
    text('Menu', 450, 335);
    text('Give Up', 450, 385);
    text('Undo', 450, 135);
    stroke(150, 150, 0);
    for (let i = 0; i < 6; i++) {
      line(405, i * 50 + this.x, 495, i * 50 + this.x);
    }
    for (let i = 0; i < 3; i++) {
      line(405, i * 100 + this.y, 405, i * 100 + this.y + 50);
      line(495, i * 100 + this.y, 495, i * 100 + this.y + 50);
    }
    pop();
  }
}
let directx = [0, 0, 1, 1, 1, -1, -1, -1];
let directy = [1, -1, 0, 1, -1, 1, 0, -1];
let dx = [0, 0, 1, 1, 1, -1, -1, -1];
let dy = [1, -1, 0, 1, -1, 1, 0, -1];
let step = [0, 1, 2, 3, 4, 5, 6, 7];
let mp, state = 0,
  task, cnt = 0,
  count;
let level = 0,
  ok, cntans = 0,
  res = 0,
  number, resx, resy;

function draw() { // là cái j chắc các anh bt rùi :v
  background(200);
  if (state == 0) Start(); // hiển thị màn hình chính
  if (state == 4) Instruction(); // hiển thị instruction
  if (state == 2) Win(); // hiển thị trạng thái thắng
  if (state == 3) Lose(); //  hiển thị trạng thái thua
  if (state == 6) { // hiển thị màn hình khi đang đưa ra đáp án
    cntans++;
    mp.display();
    push();
    strokeWeight(2);
    line(400, 0, 500, 0);
    line(500, 0, 500, 400);
    line(400, 400, 500, 400);
    line(400, 200, 500, 200);
    pop();
    push();
    fill(200, 0, 0);
    textSize(25);
    textAlign(CENTER, CENTER);
    text('Play\nAgain', 450, 100);
    text('Menu', 450, 300);
    pop();
    if (cntans == 30) {
      res++;
      cntans = 0;
    }
    for (let i = mp.ansx.length - 1; i >= mp.ansx.length - res; i--) {
      resx = mp.ansx[i];
      resy = mp.ansy[i];
      push();
      fill(100, 0, 100);
      square((resx - 1) * mp.x, (resy - 1) * mp.y, mp.x);
      pop();
    }
    for (let i = 1; i <= mp.size; i++) {
      for (let j = 1; j <= mp.size; j++) {
        push();
        textAlign(CENTER, CENTER);
        textSize(height / mp.size - 10);
        if (mp.arr[i][j] == 1) fill(grn);
        else if (mp.arr[i][j] == 2) fill(rd);
        else if (mp.arr[i][j] == 3) fill(yellow);
        else if (mp.arr[i][j] == 4) fill(blu);
        text(mp.arr[i][j], i * mp.x - mp.x / 2, j * mp.y - mp.y / 2 + 1);
        pop();
      }
    }
  }
  if (state == 1 || state == 5) { // hiển thị màn hình khi đang chơi
    if (state == 1) cnt++; // khi đang chơi 1 cách hết sức bình thường
    if (cnt == 60) {
      task.time--;
      cnt = 0;
    }
    mp.display();
    task.display();
    if (mp.isWin()) state = 2;
    else if (mp.isLose()) state = 3;
    if (state == 5) GiveUp(); // khi người chơi muốn bỏ cuộc
  }
}

function mousePressed() { // các thao tác click chuột, chọn nước đi
  if (state == 2) { // khi game đang ở màn hình thắng 
    task.score += 100;
    task.time = 60 + (level + 1) * 10;
    state = 1;
    level++;
    task.undo = level + 5;
    ok = 0;
    count = 1;
    mp = new Map;
    DFS(1, 1);
    mp.choose();
  } else if (state == 3) { // khi game đang ở màn hình thua
    if (mouseY > 360 && mouseY < 390 && mouseX < 190 && mouseX > 105) state = 0;
    else if (mouseY > 360 && mouseY < 390 && mouseX > 250 && mouseX < 380) {
      state = 6;
      res = 0;
      cntans = 0;
    }
  } else if (state == 1) { // khi đang trong trạng thái chơi game
    if (mouseX > 400 && mouseX < 500 && mouseY > 300 && mouseY < 350) { // quay trở về màn hình chính
      state = 0;
    } else if (mouseX > 400 && mouseX < 500 && mouseY > 100 && mouseY < 150) { // người chơi undo
      if (mp.stepx.length > 1 && task.undo > 0) Undo();
    } else if (mouseX > 400 && mouseX < 500 && mouseY > 350 && mouseY < 400) { // người chơi bỏ cuộc
      state = 5;
    } else { // bôi đen các ô đi
      for (let i = 1; i <= mp.size; i++) {
        for (let j = 1; j <= mp.size; j++) {
          if (mouseX > mp.x * (i - 1) && mouseX < mp.x * i) {
            if (mouseY > mp.y * (j - 1) && mouseY < mp.y * j) {
              if (mp.check[i][j] == 0 && abs(i - mp.px) <= 1 && abs(j - mp.py) <= 1) {
                if (mp.arr[i][j] == (mp.arr[mp.px][mp.py] % 4) + 1) {
                  mp.stepx.push(i);
                  mp.stepy.push(j);
                  mp.px = i;
                  mp.py = j;
                  mp.check[i][j] = 1;
                }
              }
            }
          }
        }
      }
    }
  } else if (state == 4) { // instruction
    if (mouseY < 395 && mouseY > 355 && mouseX > 335 && mouseX < 475) { // quay trở về màn hình chính
      state = 0;
    }
  } else if (state == 0) { // màn hình chính
    if (mouseX > 125 && mouseX < 375 && mouseY > 65 && mouseY < 115) { // bắt đầu chơi
      rd = color(150, 0, 0);
      grn = color(0, 150, 0);
      yellow = color(150, 150, 0);
      blu = color(0, 0, 200);
      state = 1;
      level = 0;
      task = new Taskbar;
      ok = 0;
      count = 1;
      mp = new Map;
      DFS(1, 1);
      mp.choose();
    } else if (mouseX > 125 && mouseX < 370 && mouseY > 320 && mouseY < 365) { // đọc instruction
      state = 4;
    }
  } else if (state == 5) { // lựa chọn có bỏ cuộc hay ko
    if (mouseX > 80 && mouseX < 195 && mouseY > 1 && mouseY < 400) { // người chơi chọn bỏ cuộc
      state = 3;
    } else if (mouseX > 205 && mouseX < 320 && mouseY > 200 && mouseY < 270) { // người chơi ngáo 1 vài giây nên bấm nhầm và mún chơi típ
      state = 1;
    }
  } else if (state == 6) { // khi đang trong trạng thái thua cuộc
    if (mouseX > 400 && mouseX < 500 && mouseY > 0 && mouseY < 200) { // hiện đáp án
      state = 1;
      level = 0;
      task = new Taskbar;
      ok = 0;
      count = 1;
      mp = new Map;
      DFS(1, 1);
      mp.choose();
    } else if (mouseX > 400 && mouseX < 500 && mouseY > 200 && mouseY < 400) { // người chơi quay trở về màn hình chính
      state = 0;
    }
  }
}

function Win() { // màn hình khi thắng
  push();
  image(win, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(50);
  strokeWeight(5);
  stroke(0, 0, 0);
  fill(200, 0, 0);
  text('Congratulation!!!', 250, 40);
  text('Click to next level', 250, 370);
  pop();
}

function Lose() { // màn hình khi thua
  push();
  image(lose, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(35);
  strokeWeight(1);
  fill(0, 0, 0);
  if (task.score <= 100) text(task.score + ' Scores??? Too bad !!!', 250, 40);
  if (task.score > 100 && task.score <= 300) text(task.score + ' Scores, Nice !!!', 250, 40);
  if (task.score > 300 && task.score <= 500) text(task.score + ' Scores, Good!!!', 250, 40);
  if (task.score > 500 && task.score <= 700) text(task.score + ' Scores, Perfect!!!', 250, 40);
  if (task.score > 700 && task.score <= 1000) text(task.score + ' Scores, You are Master!!!', 250, 40);
  if (task.score > 1000) text(task.score + ' Scores, You are Legends!!!', 250, 40);
  text('Menu', 150, 380);
  text('Solution', 320, 380);
  pop();
}

function Start() { // nút bắt đầu
  push();
  image(img, 0, 0);
  textAlign(CENTER, CENTER);
  textSize(50);
  strokeWeight(5);
  stroke(0, 0, 0);
  fill(250, 0, 250);
  text("Let's Play!!!", 250, 90);
  text("Instruction", 249, 340);
  pop();
}

function GiveUp() { // nút bỏ cuộc
  push();
  textSize(25);
  textAlign(CENTER, CENTER);
  strokeWeight(3);
  push();
  stroke(0, 100, 100);
  rect(75, 125, 250, 150);
  rect(80, 200, 115, 70);
  rect(205, 200, 115, 70);
  pop();
  text('Do you really want', 200, 150);
  text('to give up?', 200, 175);
  textSize(35);
  text('YES', 135, 238);
  text('NO', 260, 238);
  pop();
}

function Undo() { // nút undo
  mp.check[mp.px][mp.py] = 0;
  mp.stepx.pop();
  mp.stepy.pop();
  mp.px = mp.stepx[mp.stepx.length - 1];
  mp.py = mp.stepy[mp.stepy.length - 1];
  task.undo--;
  task.score -= 10;
}

function Instruction() { // chỉ dẫn
  push();
  textSize(25);
  text('10 Minh Ước:\n', 10, 30);
  textSize(15);
  text('-Cho 1 bảng n*n, tìm 1 đường đi từ ô trên cùng bên trái đến ô dưới cùng\nbên phải sao cho các số trên đường đi tạo thành 1 dãy các số\n1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, ..., đồng thời phải đi qua các ô màu vàng.', 10, 50);
  text('-Tại 1 vị trí, bạn có thể đi sang 8 vị trí xung quanh bằng cách click chuột\ntrái vào vị trí bạn muốn đến nhưng không được đi qua 1 ô 2 lần.', 10, 110);
  text('-Mỗi màn chơi sẽ cho bạn 100 điểm.', 10, 148);
  text('-Click chuột trái vào vị trí undo để dùng chức năng này.', 10, 168);
  text('-Lưu ý: Mỗi lần undo, bạn sẽ bị trừ 10 điểm và số lượt undo bị giới hạn.', 10, 188);
  text('-Bạn sẽ thua khi hết giờ hoặc\nkhông thể đi tiếp và đã hết số\nlượt sử dụng undo.', 275, 215);
  text('-Level càng cao càng khó.', 275, 270);
  text('-Trò chơi đảm bảo tồn tại một\nđường đi đến đích', 275, 290);
  text('-Khi thua, đáp án sẽ hiện lên.', 275, 330);
  textAlign(CENTER, CENTER);
  textSize(18);
  text('Chúc mọi người chơi vui vẻ', 383, 345);
  textSize(40);
  fill(200, 0, 0);
  text('BACK', 385, 380);
  image(instruct, 0, 200);
  pop();
}