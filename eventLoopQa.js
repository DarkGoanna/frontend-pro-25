// 1
console.info("foo"); // первый
console.info("bar"); // второй
console.info("baz"); // третий, все идут друг за другом в основном потоке

// 2
console.info("foo"); // первый
setTimeout(() => console.info("bar"), 1000); //третий, потому что таймер попадет в таск очередь и выполнится после основного потока
console.info("baz"); // второй

// 3
console.info("foo"); //первый
setTimeout(() => console.info("bar"), 0); //третий, то же самое что в прошлом примере, не смотря на нулевую задержку. таймер падает в таск очередеь, основной поток выполнился, ждем 0 секунд и выполняем
console.info("baz"); //второй

// 4
const timer = setInterval(() => {
  console.info("foo"); // второй (интервал попал в таск очередь)
  setTimeout(() => clearTimeout(timer), 0); // остановили интервал
}, 1000);
setTimeout(() => console.info("bar"), 1000); //третий (таймер попал в таск очередь и находится после интервала, когда тот выполнится - запустится этот таймаут)
console.info("baz"); //первый (основной поток)

// 5
const timer = setInterval(() => {
  setTimeout(() => {
    console.info("foo"); //второй
    clearTimeout(timer); //закрыли интервал
  }, 0);
}, 1000);
setTimeout(() => console.info("bar"), 1000); //третий
console.info("baz"); // первый

// 6
Promise.resolve("foo").then((res) => console.info(res)); //второй (микротаски приорететнее чем таски, эта очередь выполнится после основного потока)
setTimeout(() => console.info("bar"), 0); //третий (после завершения всей микротаск очереди, запустится таск очередь)
console.info("baz"); //первый

// 7
setTimeout(() => console.info("foo"), 0); //пятый (первый в таск очереди)
Promise.resolve("bar").then((res) => console.info(res)); //третий (первый в микротаск очереди)
console.info("baz"); //первый основной поток)
setTimeout(() => console.info("foo2"), 0); //шестой (второй в таск очереди)
Promise.resolve("bar2").then((res) => console.info(res)); //четвертый (второй в микротаск очереди)
console.info("baz2"); //второй (основной поток)

// 8
setTimeout(() => Promise.resolve("foo").then((res) => console.info(res)), 1000); //второй
Promise.resolve("bar").then((res) => {
  setTimeout(() => console.info(res), 1000); //третий
});
console.info("baz"); //первый (основной поток)
//стек вызовов: 1)таймер, 2)промис, 3)инфо
//инфо выполнился, закрылся
//промис положил таймер в таск очередь
//таймер положил промис в микротаск очередь
//после основного потока запускается микротаск очередь
//после микротаск очереди запускается таймер из таск очередт



// 9
setTimeout(() => Promise.resolve("foo").then((res) => console.info(res)), 1000); //второй
Promise.resolve("bar").then((res) => {
  setTimeout(() => console.info(res), 500); //третий
});
console.info("baz") //первый
  //тоже самое что прошлый пример



  // 10
  (async () => {
    const result = await Promise.resolve("foo");
    console.info(result); //второй (микротаск очередь)
  }
  )();
setTimeout(() => console.info("bar"), 0); //третий
console.info("baz"); //первый

// 11
setTimeout(console.info("foo"), 0); //первый, потому что нет функции которую нужно запустить через такое-то время. есть вызов консоли который выполняется немеделенно 
console.info("bar"); //второй

(async () => {
  const result = await Promise.resolve("baz");
  console.info(result); //третий
})();
