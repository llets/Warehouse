//module.paths.push('/usr/local/lib/node_modules');
const {lusolve, floor, min, abs, ones, round, multiply, transpose, subtract, sum, det} = require('mathjs')  //npm install mathjs

const epsilon=1e-13;

const L=10;

// функция, (иногда) предотвращающая ошибку аппроксимации в js
function conversion_num_to_int_if_acceptable(num){
    if (abs(num-round(num)) < epsilon){
        return round(num);
    } else{
        return num;
    }
}

// часть алгоритма МПУ
// проверка x на оптимальность: если x - оптимальный, то возвращаем его, иначе - возвращаем новые x и alfa
function checking_x_for_optimality(alfa,x,n){

    // Этап 2. Проверить, является ли x оптимальным:
    // Если вектор y - допустимый, то x - оптимальный (по признаку оптимальности).
    // Шаг 1 
    // 1.1
    
    // проверка на лин. зависимость строк матрицы (если строки зависимы, то нельзя найти y)
    if (det(alfa)==0){
        // если матрица оказалась линейной, 
        // обнуляем x (тогда b_main[] будет пустым)
        for (let i=0; i<n; i++){
            x[i][0]=0;
        }
        alfa=[];
        return [alfa,x];
    }
    y=lusolve(alfa, ones(n)); // y- двойственный вектор, y[i]−подетальные нормы расхода материала

    // 1.2. Проверить, является ли y допустимым:
    // Метод ДП для ограниченной задачи о рюкзаке
    // Прямой ход
    f=[];
    i_arr=[];
    for (let i=0; i<L; i++){
        f[i]=0;
        i_arr[i]=0;
    }

    l0=min(l);

    for (let j=l0-1; j<L; j++){
        for (let i=0; i<n; i++){
            if (l[i]<=j+1){
                if (f[j]<=(y[i][0]+f[abs(j-l[i])])){
                    f[j]=y[i][0]+f[abs(j-l[i])];
                    i_arr[j]=i+1;
                }
            }
        }
    }

    // Если в результате прямого хода выполнится условие
    if (f[L-1]<=1){
    //     то x - оптимальный вектор
        return [alfa,x];
    }else{
    // иначе, выполняется обратный ход; 
    // определяется новый способ раскроя alfa[j0] вместо одного
        alfa_new=[]; // новый способ раскроя 
        for (let i=0; i<n; i++){
            alfa_new[i]=0;            
        }
    
        l_tmp=L-1;
        while(l_tmp>=l0-1){
            alfa_new[i_arr[l_tmp]-1] +=1;
            l_tmp -= l[i_arr[l_tmp]-1];
        }

        // 1.3 Определим, какой из alfa[j] заменим на alfa_new
        // для этого найдем вспомогательный вектор g
        // но сначала проверка матрицы alfa[][] на линейность
        if (det(alfa)==0){
            // если матрица оказалась линейной, 
            // обнуляем x (тогда b_main[] будет пустым)
            for (let i=0; i<n; i++){
                x[i][0]=0;
            }
            alfa=[];
            return [alfa,x];
        } else{
            // если матрица нелинейна, все в порядке, действуем дальше по алгоритму
            g=lusolve(alfa, alfa_new);

            //1.4 
            k_old=0;
            min_e= Number.MAX_SAFE_INTEGER;
            for (let i=0; i<n; i++){
                if (g[i]>0){
                    if (min_e>x[i][0]/g[i][0]){
                        min_e=x[i][0]/g[i][0];
                        min_e=conversion_num_to_int_if_acceptable(min_e);
                        k_old=i; // номер раскроя в alfa, который хотим заменить
                    }
                }
            }

            // обновляем набор раскроев
            alfa[k_old]=alfa_new;
            // обновляем вектор x - раскройный план
            x_new=new Array(n)
            for (let i=0; i<n; i++){
                x_new[i]=new Array(1)
                x_new[i][0]=0;
            }

            for (let i=0; i<n; i++){
                if (i==k_old){
                    x_new[i][0]=min_e;
                }
                else if (g[i]>=0){
                    x_new[i][0]=x[i][0]-min_e*g[i][0];
                }else{
                    x_new[i][0]=x[i][0]
                }
            }
            for (let i=0; i<n; i++){
                x[i][0]=x_new[i][0]
            }
        }
        // переходим на этап 2
        return checking_x_for_optimality(alfa,x,n);
        
    }
}

// алгоритм МПУ
function algorithm_mpu(l,b,n){
    // этап 1 Найти исходное допустимое решение – раскрои на заготовки одного вида – однородные раскрои
    // этап 1.1. Найти однородные раскрои
    alfa=new Array(n); // исходные допустимые векторы – однородные раскрои
    for (let i = 0; i < n; i++) {
        alfa[i] = new Array(n);
    }
    for (let i=0; i<n; i++){
        for (let j=0; j<n; j++){
            alfa[i][j]=0;
        }
    }

    for (let i=0; i<n; i++){
        alfa[i][i]=floor(L/l[i]);
    }

    // этап 1.2. Найти исходный допустимый раскройный план в расчете на одно изделие:
    x=lusolve(alfa, b); // - раскройный план, количество стержней, которые будут раскраиваться по способу alfa[j]

    // Этап 2. Проверить, является ли x оптимальным:
    [alfa,x]=checking_x_for_optimality(alfa,x,n);

    return [alfa,x];
}

// округляем в нижнюю сторону числа в векторе
function round_x_to_bottom(vector,length){
    vector_floor=new Array(length)
    for (let i=0; i<length; i++){
        vector_floor[i]=floor(vector[i])
    }
    return vector_floor;
}

// начальная обработка входных данных
function initial_process_of_input(l,b,n){
    // новые вектора l,b и их длина n, 
    // в которых модели с одинаковыми размерами объединены в один элемент векторов(размеры просуммиированы)
    l_new=[];
    b_new=[];
    n_new=0;
    // счетчик кол-ва повторений (необходим для правильного формирования новых векторов)
    count_of_repeats=0; 
 
    // заполнение новых векторов без повторений в l
    for (let i=0; i<n; ++i){
        l_new.push(l[i]);
        n_new +=1;
        b_new.push(b[i]);
        // проходимся по уже заполненной части вектора l_new 
        // и смотрим, нет ли там элемента с таким же значением размера
        for (let j=0; j<i-count_of_repeats; j++){
            if (l[i]==l_new[j]){
                l_new.pop();
                b_new[j] +=b_new.pop();
                n_new -=1;
                count_of_repeats +=1;
            }
        }
    }
 
    // т.к., сформировав новые векторы и n, мы потеряли часть информации
    // (об отдельном кол-ве моделей с одинаковыми размерами),
    // необходима возможность ее восстановить - 
    // для этого формируем 2мерный массив[n_new][], в котором нулевой элемент в каждой строке - размер из l_new
    // а далее индексы моделей в первоначальных векторах, имеющих этот размер
    arr_of_sizes_place=new Array(n_new);
    for (let i = 0; i < n_new; i++) {
        arr_of_sizes_place[i] = new Array(0);
    }
    for (let i=0; i<n_new; i++){
        arr_of_sizes_place[i].push(l_new[i]);
        for (let j=0; j<n; j++){
            if (arr_of_sizes_place[i][0]==l[j]){
                arr_of_sizes_place[i].push(j);
            }
        }
    }
    
    return [l_new,b_new,n_new, arr_of_sizes_place];
}

// запуск алгоритма и обработка результата
function run_and_preprocess_result_of_algorithm_mpu(l,b,n){
    // запускаем основной алгоритм - алгоритм линейного раскроя
    [alfa,x] = algorithm_mpu(l,b,n);

    // пост-обработка результата алгоритма
    x_floor =round_x_to_bottom(x,n) // вектор x с округл.-ми в нижн. сторону(т.е. целыми) значениями

    alfa_T = transpose(alfa) // транспонированная alfa - необходима для дальн. подсчетов

    b_main=new Array(n); // кол-ва товаров в каждой модели(b) для заполнения полностью пустых полок
    if (alfa.toString()!=([]).toString()){ // если матрица не пуста
        b_main_ = multiply(alfa_T,x_floor);
        for (let i=0; i<n; i++){
            b_main[i]=b_main_[i][0];
        }
    } else{
        for (let i=0; i<n; i++){
            b_main[i]=0;
        }
    }
    b_others = subtract(b,b_main); // кол-ва оставшихся товаров 

    return [alfa,x_floor,b_main, b_others];
}

// находим кол-во целых полок, необходимых для размещения части(меньшей, в большинстве случаев) товаров
// также (раз уж запустили эту функцию) находим размещения товаров в этих полках
function count_shelves_for_b_others_items_fun(l, b_others, n){
    count_of_shelves=0; // кол-во необходимых полок 
    arr_x_alfa=[]; // 2-мерный массив, в котором каждая строка - размеры товаров, которые должны быть размещены в одной полке

    // если изначально b_others[] пуст, т.е. алгоритм МПУ дал целочисленный вектор x[], то выходим из функции
    if (sum(b_others)==0){
        return [count_of_shelves, arr_x_alfa];
    }
    // удаляем пустые элементы b_others[] и соответственные эл-ты l[]
    b__=[];
    l__=[];
    n__=[];
    for (let i=0; i<n; i++){
        if (b_others[i]>0){
            b__.push(b_others[i]);
            l__.push(l[i]);
            n__++;
        }
    }
    b_others=b__;
    l=l__;
    n=n__;

    // сортируем массив l[] по убыванию, и вместе с ним эл-ты b_others[] также соответственно меняют места,
    // это нужно для наиболее эффективного заполнения полок (сначала пытаемся разместить самые большие товары, далее - что еще влезет в эту полку)
    for (let i=0; i<n; i++){
        for (let j=i+1; j<n; j++){
            if (l[i]<l[j]){
                l_tmp=l[i];
                l[i]=l[j];
                l[j]=l_tmp;
                b_tmp=b_others[i];
                b_others[i]=b_others[j];
                b_others[j]=b_tmp;
            }
        }
    }

    // заполняем полки и "запоминаем" их заполнения в arr_x_alfa[][]
    while (sum(b_others)>0){
        x_alfa=[] // посл-ть размеров товаров, которые должны быть размещены в одной полке
        empty_space_in_shelf=L;
        for (let i=0; i<n; i++){
            if (b_others[i]>0 && l[i]<=empty_space_in_shelf){
                x_alfa.push(l[i]);
                b_others[i]--;
                empty_space_in_shelf -= l[i];
                i--;
            }
        }
        arr_x_alfa.push(x_alfa);
        count_of_shelves +=1;
    }

    return [count_of_shelves, arr_x_alfa];
}

// пытаемся заполнить частично пустые полки новыми товарами
function fill_partially_empty_shelves(arr_shelvesId, arr_shelvesSizes, l,b,n, arr_id_of_shelves_of_new_goods){
    // копируем массивы l[] и b[] перед сортировкой
    l_old=new Array(n);
    b_old=new Array(n);
    for (let i=0; i<n; i++){
        l_old[i]=l[i];
        b_old[i]=b[i];
    }
    // сортируем массив l[] по убыванию, и вместе с ним эл-ты b[] также соответственно меняют места,
    // это нужно для наиболее эффективного заполнения полок (сначала пытаемся разместить самые большие товары, далее - что еще влезет в эту полку)
    for (let i=0; i<n; i++){
        for (let j=i+1; j<n; j++){
            if (l[i]<l[j]){
                l_tmp=l[i];
                l[i]=l[j];
                l[j]=l_tmp;
                b_tmp=b[i];
                b[i]=b[j];
                b[j]=b_tmp;
            }
        }
    }

    // сортируем массив arr_shelvesSizes[] по убыванию, и вместе с ним эл-ты arr_shelvesId[] также соответственно меняют места
    // это нужно для более быстрого размещения товаров в случае, если они полностью поместятся в частично свободных
    // length=arr_shelvesSizes.length;
    // for (let i=0; i<length; i++){
    //     for (let j=i+1; j<length; j++){
    //         if (arr_shelvesSizes[i]<arr_shelvesSizes[j]){
    //             arr_shelvesSizes_tmp=arr_shelvesSizes[i];
    //             arr_shelvesSizes[i]=arr_shelvesSizes[j];
    //             arr_shelvesSizes[j]=arr_shelvesSizes_tmp;
    //             arr_shelvesId_tmp=arr_shelvesId[i];
    //             arr_shelvesId[i]=arr_shelvesId[j];
    //             arr_shelvesId[j]=arr_shelvesId_tmp;
    //         }
    //     }
    // }

    flag=0;
    // пытаемся максимально заполнить полки и "запоминаем" их заполнения сразу в arr_id_of_shelves_of_new_goods[n][]
    while (sum(b)>0 && arr_shelvesId.length>0){ // условием выхода из цикла может быть 2 ситуации: кончились товары для размещения; кончились полки
        empty_space_in_shelf=arr_shelvesSizes.shift(); // незанятое пространство полки
        tmp_shelf_id=arr_shelvesId.shift(); // id частично занятой полки
        if (l[n-1]<=empty_space_in_shelf){ // если свободного места на полке меньше, чем размер самого маленького товара, то нет смысла разместить что-то
            flag=1; // если хотя бы один товар помещается в частично свободные полки, то возвращаемый b будет отличаться
            for (let i=0; i<n; i++){
                if (b[i]>0 && l[i]<=empty_space_in_shelf){ // если товар помещается в полку
                    index_in_l_old=l_old.indexOf(l[i]); // определяем его индекс в первоначальном массиве l[]
                    arr_id_of_shelves_of_new_goods[index_in_l_old].push(tmp_shelf_id); // сохраняем инф. о расположении товара
                    b[i]--; // "удаляем" размещенный товар
                    empty_space_in_shelf -= l[i]; // учитываем, что теперь в полке также находится 
                    i--; // возможно, товары такого же размера еще могут поместиться на полке, поэтому проверяем этот размер еще раз
                }
            }
        }
    }

    if (flag!=0){ // хотя бы один товар был размещен, возвращаем обновленный b
         // переставляем элементы b[] так, чтобы они соответствовали l_old[] 
        for (let i=0; i<n; i++){
            index_in_old_version=l_old.indexOf(l[i]);
            b_old[index_in_old_version]=b[i];
        }
    }

    return [b_old, l_old]; // т.к. мы изменяли элементы в коде функции l[] и b[], то будем возвращать нужные нам l[] и b[]
}

function add(arr_modelsId,l,b, userId, count_of_empty_shelves, arr_shelvesId, arr_shelvesSizes, arr_empty_shelvesId,
    first_empty_shelf_Id, last_id_of_goods){
    //first_empty_shelf_Id = "1"
    // 1) Проверяем, что нам хватит места на складе для новых товаров (но, 
    //    возможно, товары не удастся разместить, даже если эта проверка прошла)
    let input_data = {
        "arr_models_Id": arr_modelsId,
        "arr_models_sizes": l,
        "amount of goods of each model": b, 
        "count_of_empty_shelves": count_of_empty_shelves, 
        "arr_shelvesId": arr_shelvesId,
        "arr_shelvesSizes": arr_shelvesSizes,
        "arr_empty_shelvesId": arr_empty_shelvesId,
        "first_empty_shelf_Id": first_empty_shelf_Id,
        "last_id_of_goods": last_id_of_goods,
    }
    console.log(input_data)
    // проверяем входные данные на корректность
    if (arr_modelsId.length!=b.length || b.length!=l.length){
        return ["Получены некорректные данные!", null, null];
    }
    n=l.length;


    // еще одна прорверка на то, что размер моделей <L
    for (let i=0; i<n; i++){
        if (l[i]>=L){
            return ["Размер моделей некорректен!", null, null];
        }
    }

    // считаем общий размер новых товаров
    new_goods_size=0;
    for (let i=0; i<n; i++){
        new_goods_size += l[i]*b[i];
    }

    // считаем размер оставшегося места на складе - запросы в бд и сложение
    empty_space_in_warehouse=0;

    /////////////////////////////////////////////////////////////////////////////////////
    // найти count_of_empty_shelves кол-во полностью свободных полок(у которых occup_size == 0) 
    /////////////////////////////////////////////////////////////////////////////////////
    //count_of_empty_shelves=16; // заменить

    empty_space_in_warehouse +=count_of_empty_shelves*L;

    /////////////////////////////////////////////////////////////////////////////////////
    // найти и поместить в два одномерных массива или в прямоугольный двумерный массив 2*X 
    // все id_полок, которые частично свободны(у которых occup_size != 0) (в первой строке)
    // и соответственно их свободные простр-ва (max_size - occup_size) (во второй строке)
    /////////////////////////////////////////////////////////////////////////////////////
    //arr_shelvesId=[34,56,78,79,83,90,91,92,93,100]; // заменить
    //arr_shelvesSizes=[1,1,3,6,8,2,9,7,8,9]; // заменить

    len1 = arr_shelvesId.length;
    // проверка на отс. ошибок
    if (arr_shelvesSizes.length != len1){
        return ["Некорректный запрос к БД 1!", null, null];
    }
    // если все ок, добавляем размер полупустых полок
    for (let i=0; i<len1; i++){
        empty_space_in_warehouse +=arr_shelvesSizes[i];
    }

    // если размер всех товаров больше, чем свободное пространство склада, выводим сообщение пользователю об этом
    if (empty_space_in_warehouse<new_goods_size){
        msg="Недостаточно места на складе!";
    }
    else{
        // 2) Предобрабатываем входные данные 

        // делаем копию b, т.к. в ходе работы программы он может изменяться
        b_copy=new Array(n);
        for (let i=0; i<n; i++){
            b_copy[i]=b[i];
        }

        // создаем непрямоугольный двумерный массив arr_id_of_shelves_of_new_goods[n][] (c кол-вом строк = n),
        // в котором i-я строка - массив размера b[i],
        // заполненный id_полок, в которые будут размещены все новые товары
        arr_id_of_shelves_of_new_goods=new Array(n);
        for(let i=0; i<n; i++){
            arr_id_of_shelves_of_new_goods[i]=new Array(0);
        }

        /////////////////////////////////////////////////////////////////////////////////////
        // найти и поместить в массив все id_полок, которые полностью свободны(у которых occup_size == 0)
        /////////////////////////////////////////////////////////////////////////////////////
        //arr_empty_shelvesId=[1,4,5,8,10,11,12,13,14,15,16,17,18,19,20,21]; // заменить

        /////////////////////////////////////////////////////////////////////////////////////
        // найти с конца first_empty_shelf_Id самый маленький id_полки, у которой occup_size ==0, т.е. id_полки такой, 
        // что у следующий id_полки-1 occup_size != 0
        // если таких полок нет, т.е. если 1024я полка занята, то пусть id этой полки будет = 1025
        /////////////////////////////////////////////////////////////////////////////////////
        //first_empty_shelf_Id=10; // заменить 
        if (arr_empty_shelvesId.length!=0){
            if (first_empty_shelf_Id==1025){
                // меняем несуществующий id=1025 на последний из существующих id_свободных_полок
                first_empty_shelf_Id=arr_empty_shelvesId[arr_empty_shelvesId.length-1];
            } 
        }else{ // 3.0) случай, когда у нас вообще нет свободных полок 
            // запускаем функцию размещения в частично свободные полки

            sum_b_elements=sum(b); // сумма всех эл-в b , нужна будет для проверки, что мы поместили в частично свободные полки хотя бы 1 товар

            [b,l]=fill_partially_empty_shelves(arr_shelvesId, arr_shelvesSizes, l,b,n, arr_id_of_shelves_of_new_goods);

            if (sum(b)==0){ // 3.0.1) удалось полностью разместить новые товары в полках, дополнительно никаких размещений не требуется

                // создаем новые товары, обновляем БД
                for (let i=0; i<arr_id_of_shelves_of_new_goods.length; i++){
                    console.log(arr_id_of_shelves_of_new_goods[i]);
                }
        
                /////////////////////////////////////////////////////////////////////////////////////
                // в переменную last_id_of_goods внести последнюю id_товаров (если нет товаров, то 0)
                /////////////////////////////////////////////////////////////////////////////////////
                //last_id_of_goods=0; // заменить
                tmp_id_of_good=last_id_of_goods+1;
        
                /////////////////////////////////////////////////////////////////////////////////////
                // создаем непрямоугольный двумерный массив arr_id_of_new_goods_of_n_models[n][] (c кол-вом строк = n),
                // в котором i-я строка - массив размера b_copy[i],
                // заполненный id_новых_товаров, их мы генерируем, опираясь на данные last_id_of_goods
                // (значения idшек для 0-й модели: от last_id_of_goods+1 до last_id_of_goods+b_copy[0])
                // и, проходясь циклом по каждому массиву(цикл в цикле), 
                // добавляем в таблицу Товаров новые товары i-й модели, беря modelId = arr_modelsId[i] и id_товаров из i-го сгенерированного массива
                // попутно можем обновлять таблицу Лога_действий(если можем)
                /////////////////////////////////////////////////////////////////////////////////////
                // обновляем таблицу Полок, увеличивая occup_size на l[i], если id_полки есть в строке i в arr_id_of_new_goods_of_n_models[][]
                /////////////////////////////////////////////////////////////////////////////////////
                arr_id_of_new_goods_of_n_models= new Array(n);
                for (let i=0; i<n; i++){
                    arr_id_of_new_goods_of_n_models[i]=new Array(b_copy[i]);
                    for (let j=0; j<b_copy[i]; j++){
                        arr_id_of_new_goods_of_n_models[i][j]=tmp_id_of_good;
                        tmp_id_of_good++;
                    }
                }
        
                console.log("\n");
                for (let i=0; i<arr_id_of_new_goods_of_n_models.length; i++){
                    console.log(arr_id_of_new_goods_of_n_models[i]);
                }
        
                /////////////////////////////////////////////////////////////////////////////////////
                // имея на этом этапе непрямоугольный двумерный массив arr_id_of_shelves_of_new_goods[n][],
                // с помощью цикла в цикле заполняем таблицу Хранилища,
                // беря shelfId = arr_id_of_shelves_of_new_goods[i][j]
                // и goodId = arr_id_of_new_goods_of_n_models[i][j]
                /////////////////////////////////////////////////////////////////////////////////////

                //console.log(`Иды полок новых товаров: ${arr_id_of_shelves_of_new_goods}`)
                return ["Все товары успешно размещены на складе!!", arr_id_of_shelves_of_new_goods, arr_id_of_new_goods_of_n_models];

            } else{// 3.0.2) не удалось полностью разместить новые товары в полках. т.к. у нас полностью свободных полок, то мы никак не сможем разместить новые товары
                return ["Недостаточно места на складе!!!!", null, null];
            }
        }

        // находим индекс "начала" незанятой части склада
        index_of__first_empty_shelf_Id=arr_empty_shelvesId.indexOf(first_empty_shelf_Id);

        //    если есть товары с одинаковыми размерами, то складываем их кол-ва
        //    (если этого не сделать, алгоритм будет работать неправильно)
        [l_new,b_new,n_new,arr_of_sizes_place] = initial_process_of_input(l,b,n);

        // 3) Запускаем алгоритм МПУ и проводим предобработку результата:
        //    делим b на b_main и b_others - соответственно отн-ся к тем товарам, 
        //    которые займут опр-ное число полностью пустых полок, и оставшимся товарам
        [alfa,x_floor,b_main, b_others]=run_and_preprocess_result_of_algorithm_mpu(l_new,b_new,n_new);

        // 3.1) Пытаемся разместить все товары в свободной части склада, в полностью свободных полках

        // находим кол-во целых полок, необходимых для размещения части(большей, но не всегда) товаров
        count_shelves_for_b_main_items=sum(x_floor);

        // находим кол-во целых полок, необходимых для размещения части(меньшей, но не всегда) товаров
        [count_shelves_for_b_others_items, arr_x_alfa]=count_shelves_for_b_others_items_fun(l_new,b_others, n_new);
        
        if (count_of_empty_shelves>=count_shelves_for_b_main_items+count_shelves_for_b_others_items){
            // 3.2) Если товары помещаются в полностью свободные полки, то находим размещение товаров в них
            // но, возможно, в том числе будут использоваться те пустые полки, которые находятся в занятой части склада

            // Независимо от того, хватает места в незанятой части склада или нет, формируем массив arr_empty_shelvesId_ordered,
            // который по сути есть переупорядоченный массив arr_empty_shelvesId
            // сначала копируем id_полок незанятой части, далее - занятой
            arr_empty_shelvesId_ordered=[];
            for (let i=index_of__first_empty_shelf_Id; i<arr_empty_shelvesId.length; i++){
                arr_empty_shelvesId_ordered.push(arr_empty_shelvesId[i]);
            }
            for (let i=0; i<index_of__first_empty_shelf_Id; i++){
                arr_empty_shelvesId_ordered.push(arr_empty_shelvesId[i]);
            }

            // определяем размещение товаров в полках
            // сначала размещаем товары для b_main[]
            // заполняем arr_id_of_shelves_of_new_goods[][], обрабатывая x_floor[] и каждую строку alfa[i]
            // и заполняя возможно сразу несколько строк arr_id_of_shelves_of_new_goods[][]
            if (alfa.toString()!=([]).toString()){ // если матрица не пуста
                for (let i=0; i<n_new; i++){
                    while (x_floor[i][0]>0){
                        tmp_id_shelf=arr_empty_shelvesId_ordered.shift();
                        for (let j=0; j<n_new; j++){
                                for (let k=0; k<alfa[i][j]; k++){
                                    arr_id_of_shelves_of_new_goods[j].push(tmp_id_shelf);
                                }
                            }
                        x_floor[i][0]--;
                    }
                    
                }
            }
            // теперь размещаем товары для b_others[] 
            // а здесь обрабатываем построчно arr_x_alfa[]
            for (let i=0; i<count_shelves_for_b_others_items; i++){
                tmp_id_shelf=arr_empty_shelvesId_ordered.shift();
                while (arr_x_alfa[i].length>0){
                    size_of_good=arr_x_alfa[i].pop();
                    index_of_size_in_l_new=l_new.indexOf(size_of_good);
                    arr_id_of_shelves_of_new_goods[index_of_size_in_l_new].push(tmp_id_shelf);
                }
            }

            // если first_empty_shelf_Id==1025 может сделать его равным arr_empty_shelvesId[length]
        } else{
            // 3.3) Если товары не помещаются в полностью свободные полки,
            //      запускаем функцию размещения в частично свободные полки

            sum_b_elements=sum(b_new); // сумма всех эл-в b , нужна будет для проверки, что мы поместили в частично свободные полки хотя бы 1 товар

            [b_new,l_new]=fill_partially_empty_shelves(arr_shelvesId, arr_shelvesSizes, l_new,b_new,n_new, arr_id_of_shelves_of_new_goods);

            if (sum(b_new)==0){ // 3.3.1) удалось полностью разместить новые товары в полках, дополнительно никаких размещений не требуется
                msg ="Все товары успешно размещены на складе!";
            } else if(sum(b_new)==sum_b_elements){ 
                // 3.3.2) ни один товар не поместился ни в одну из полок, значит мы не сможем разместить все новые товары в склад в его текущем состоянии
                // возможно, если перемещать размещеннпые ранее товары, то можно добиться достаточного места для новых товаров.
                // но мы не выполняем алгоритм полного перерасчета из той логики, что перестановки старых товаров ради размещения новых могут быть слишком энергозатратны
                console.log(`l: ${l}, b: ${JSON.stringify(b)}`)
                return ["Недостаточно места на складе!!", null, null]
            }
            else { // 3.3.3)хотя бы один товар смог поместиться на частично свободных полках
                // проверяем для нового b[], можно ли теперь разместить оставшиеся новые товары в полностью пустых полках

                //    Запускаем алгоритм МПУ и проводим предобработку результата:
                //    делим b на b_main и b_others - соответственно отн-ся к тем товарам, 
                //    которые займут опр-ное число полностью пустых полок, и оставшимся товарам
                [alfa,x_floor,b_main, b_others]=run_and_preprocess_result_of_algorithm_mpu(l_new,b_new,n_new);

                //    Пытаемся разместить все товары в свободной части склада, в полностью свободных полках

                // находим кол-во целых полок, необходимых для размещения части(большей, но не всегда) товаров
                count_shelves_for_b_main_items=sum(x_floor);

                // находим кол-во целых полок, необходимых для размещения части(меньшей, но не всегда) товаров
                [count_shelves_for_b_others_items, arr_x_alfa]=count_shelves_for_b_others_items_fun(l_new,b_others, n_new);

                if (count_of_empty_shelves>=count_shelves_for_b_main_items+count_shelves_for_b_others_items){
                    // Если товары помещаются в полностью свободные полки, то находим размещение товаров в них
                    // но, возможно, в том числе будут использоваться те пустые полки, которые находятся в занятой части склада
        
                    // находим индекс "начала" незанятой части склада
                    index_of__first_empty_shelf_Id=arr_empty_shelvesId.indexOf(first_empty_shelf_Id);
        
                    // Независимо от того, хватает места в незанятой части склада или нет, формируем массив arr_empty_shelvesId_ordered,
                    // который по сути есть переупорядоченный массив arr_empty_shelvesId
                    // сначала копируем id_полок незанятой части, далее - занятой
                    arr_empty_shelvesId_ordered=[];
                    for (let i=index_of__first_empty_shelf_Id; i<arr_empty_shelvesId.length; i++){
                        arr_empty_shelvesId_ordered.push(arr_empty_shelvesId[i]);
                    }
                    for (let i=0; i<index_of__first_empty_shelf_Id; i++){
                        arr_empty_shelvesId_ordered.push(arr_empty_shelvesId[i]);
                    }
        
                    // определяем размещение товаров в полках
                    // сначала размещаем товары для b_main[]
                    // заполняем arr_id_of_shelves_of_new_goods[][], обрабатывая x_floor[] и каждую строку alfa[i]
                    // и заполняя возможно сразу несколько строк arr_id_of_shelves_of_new_goods[][]
                    if (alfa.toString()!=([]).toString()){ // если матрица не пуста
                        for (let i=0; i<n_new; i++){
                            while (x_floor[i][0]>0){
                                tmp_id_shelf=arr_empty_shelvesId_ordered.shift();
                                for (let j=0; j<n_new; j++){
                                        for (let k=0; k<alfa[i][j]; k++){
                                            arr_id_of_shelves_of_new_goods[j].push(tmp_id_shelf);
                                        }
                                    }
                                x_floor[i][0]--;
                            }
                            
                        }
                    }
                    // теперь размещаем товары для b_others[] 
                    // а здесь обрабатываем построчно arr_x_alfa[]
                    for (let i=0; i<count_shelves_for_b_others_items; i++){
                        tmp_id_shelf=arr_empty_shelvesId_ordered.shift();
                        while (arr_x_alfa[i].length>0){
                            size_of_good=arr_x_alfa[i].pop();
                            index_of_size_in_l_new=l_new.indexOf(size_of_good);
                            arr_id_of_shelves_of_new_goods[index_of_size_in_l_new].push(tmp_id_shelf);
                        }
                    }
                } else{ // в пустых полках оставшиеся новые товары все равно не могут быть размещены
                    return ["Недостаточно места на складе!!!", null, null];
                }
            }
        }

        // 4) Если мы еще не вышли из функции, значит, разместить товары можно
        // создаем товары, обновляем БД

        // если b_copy[]!=b_new[], то разделить какую-то строку/-и arr_id_of_shelves_of_new_goods[][]
        if (b_copy.toString()!=b_new.toString()){
            arr_id_of_shelves_of_new_goods__=new Array(n);
            for (let i=0; i<arr_of_sizes_place.length; i++){
                for (let j=1; j<arr_of_sizes_place[i].length; j++){
                    index_of_string_in_arr=arr_of_sizes_place[i][j];
                    arr_id_of_shelves_of_new_goods__[index_of_string_in_arr]=new Array(0);
                    // копируем из матрицы для l_new[] и b_new[] часть id_полок для опр-й модели в нужную строку
                    for (let k=0; k<b_copy[index_of_string_in_arr]; k++){
                        arr_id_of_shelves_of_new_goods__[index_of_string_in_arr].push(arr_id_of_shelves_of_new_goods[i].shift())
                    }
                }
            }
            arr_id_of_shelves_of_new_goods=arr_id_of_shelves_of_new_goods__;
        }

        for (let i=0; i<arr_id_of_shelves_of_new_goods.length; i++){
            console.log(arr_id_of_shelves_of_new_goods[i]);
        }

        /////////////////////////////////////////////////////////////////////////////////////
        // в переменную last_id_of_goods внести последнюю id_товаров (если нет товаров, то 0)
        /////////////////////////////////////////////////////////////////////////////////////
        //last_id_of_goods=0; // заменить
        tmp_id_of_good=last_id_of_goods+1;

        /////////////////////////////////////////////////////////////////////////////////////
        // создаем непрямоугольный двумерный массив arr_id_of_new_goods_of_n_models[n][] (c кол-вом строк = n),
        // в котором i-я строка - массив размера b_copy[i],
        // заполненный id_новых_товаров, их мы генерируем, опираясь на данные last_id_of_goods
        // (значения idшек для 0-й модели: от last_id_of_goods+1 до last_id_of_goods+b_copy[0])
        // и, проходясь циклом по каждому массиву(цикл в цикле), 
        // добавляем в таблицу Товаров новые товары i-й модели, беря modelId = arr_modelsId[i] и id_товаров из i-го сгенерированного массива
        // попутно можем обновлять таблицу Лога_действий(если можем)
        /////////////////////////////////////////////////////////////////////////////////////
        // обновляем таблицу Полок, увеличивая occup_size на l[i], если id_полки есть в строке i в arr_id_of_new_goods_of_n_models[][]
        /////////////////////////////////////////////////////////////////////////////////////
        arr_id_of_new_goods_of_n_models= new Array(n);
        for (let i=0; i<n; i++){
            arr_id_of_new_goods_of_n_models[i]=new Array(b_copy[i]);
            for (let j=0; j<b_copy[i]; j++){
                arr_id_of_new_goods_of_n_models[i][j]=tmp_id_of_good;
                tmp_id_of_good++;
            }
        }

        console.log("\n");
        for (let i=0; i<arr_id_of_new_goods_of_n_models.length; i++){
            console.log(arr_id_of_new_goods_of_n_models[i]);
        }

        /////////////////////////////////////////////////////////////////////////////////////
        // имея на этом этапе непрямоугольный двумерный массив arr_id_of_shelves_of_new_goods[n][],
        // с помощью цикла в цикле заполняем таблицу Хранилища,
        // беря shelfId = arr_id_of_shelves_of_new_goods[i][j]
        // и goodId = arr_id_of_new_goods_of_n_models[i][j]
        /////////////////////////////////////////////////////////////////////////////////////

        msg="Все товары успешно размещены на складе!";
    }
    //console.log(`иды полок новых товаров: ${JSON.stringify(arr_id_of_shelves_of_new_goods)}`)
    return [msg, arr_id_of_shelves_of_new_goods, arr_id_of_new_goods_of_n_models]
}

arr_modelsId=[23,45,56,6];
l=[3,4,5,7];
b=[3,5,1,1]; //тест для случая 3.0.1
//b=[3,5,3,4];
userId=1;

//console.log(add(arr_modelsId,l,b,userId));

module.exports = {add}




