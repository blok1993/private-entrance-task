describe("declOfNum", function() {

    describe("Выбирается нужная форма слова 'участник', в зависимости от заданного числа", function() {

        let endingsArr = ['участник', 'участника', 'участников'];

        it("В случае если число равно 0, будет использована форма: 'участников'", function() {
            assert.equal(declOfNum(0, endingsArr), 'участников');
        });

        it("В случае если число равно 1, будет использована форма: 'участник'", function() {
            assert.equal(declOfNum(1, endingsArr), 'участник');
        });

        it("В случае если число равно 25, будет использована форма: 'участников'", function() {
            assert.equal(declOfNum(25, endingsArr), 'участников');
        });

        it("В случае если число равно 43, будет использована форма: 'участника'", function() {
            assert.equal(declOfNum(43, endingsArr), 'участника');
        });

    });

});

describe("datesHaveIntersection", function() {

    describe("Функция возвращает true, если даты имеют пересечение между собой", function() {

        let expectedTrue = true;
        let expectedFalse = false;

        let date1 = {
            dateStart: new Date(2018, 0, 10, 10, 0, 0),
            dateEnd: new Date(2018, 0, 10, 16, 0, 0)
        };

        let date2 = {
            start: new Date(2018, 0, 10, 8, 0, 0),
            end: new Date(2018, 0, 10, 12, 0, 0)
        };

        it("Первая встреча длится с 10 до 16, вторая с 8 до 12. Пересечение есть => возвращаем " + expectedTrue, function() {
            assert.equal(datesHaveIntersection(date1, date2), expectedTrue);
        });


        let date3 = {
            dateStart: new Date(2018, 0, 10, 10, 0, 0),
            dateEnd: new Date(2018, 0, 10, 16, 0, 0)
        };

        let date4 = {
            start: new Date(2018, 0, 10, 11, 0, 0),
            end: new Date(2018, 0, 10, 13, 0, 0)
        };

        it("Первая встреча длится с 10 до 16, вторая с 11 до 13. Пересечение есть => возвращаем " + expectedTrue, function() {
            assert.equal(datesHaveIntersection(date3, date4), expectedTrue);
        });


        let date5 = {
            dateStart: new Date(2018, 0, 10, 10, 0, 0),
            dateEnd: new Date(2018, 0, 10, 12, 0, 0)
        };

        let date6 = {
            start: new Date(2018, 0, 10, 13, 0, 0),
            end: new Date(2018, 0, 10, 18, 0, 0)
        };

        it("Первая встреча длится с 10 до 12, вторая с 13 до 18. Пересечения нет => возвращаем " + expectedFalse, function() {
            assert.equal(datesHaveIntersection(date5, date6), expectedFalse);
        });

    });

});

describe("createDateFromParts", function() {

    describe("Создает полноценную дату из частей (Год, месяц, день, часы, минуты)", function() {

        let expectedDate1 = new Date(2018, 0, 20, 22, 45, 0);

        it("Создаем дату из 2018-0-20 и строки HHmm = 2245", function() {
            assert.equal(createDateFromParts(new Date(2018, 0, 20), "2245").getTime(), new Date(expectedDate1).getTime());
        });

        let expectedDate2 = new Date(2018, 2, 13, 23, 10, 0);

        it("Создаем дату из 2018-2-13 и строки HHmm = 2310", function() {
            assert.equal(createDateFromParts(new Date(2018, 2, 13), "2310").getTime(), new Date(expectedDate2).getTime());
        });
    });

});