describe("courses index page", () => {

  before(() => {
    cy.exec('pnpm -C "backend" seed:department:clear');
    cy.exec('pnpm -C "backend" seed:department');
    cy.exec('pnpm -C "backend" seed:course:clear');
    cy.exec('pnpm -C "backend" seed:course');
    cy.wait(100);
  })

  it("type 課名搜尋", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("input:first").click().type("軟體工程實務").trigger("input");

    cy.get("tbody>tr>th").eq(1).should("have.text", "軟體工程實務");
  });

  it("type 課號搜尋", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("input:first").click().type("SE6030*").trigger("input");

    cy.get("tbody>tr>th").eq(0).should("have.text", "111-上");
    cy.get("tbody>tr>th").eq(1).should("have.text", "軟體工程實務");
    cy.get("tbody>tr>th").eq(2).should("have.text", "梁德容, 王尉任, 鄭永斌");
    cy.get("tbody>tr>th").eq(3).should("have.text", "資訊工程學系");
  });

  it("type 老師搜尋", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("input:first").click().type("梁德容").trigger("input");

    cy.get("tbody>tr>th").eq(2).invoke("text").should("contains", "梁德容");
  });

  it("click 未打勾之進階搜尋的框框", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("#advanceSearch").check();
    cy.wait(1000);

    cy.contains("所有學期").should("be.visible");
  });

  it("click 已打勾之進階搜尋的框框", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("#advanceSearch").check();
    cy.wait(1000);
    cy.get("#advanceSearch").uncheck();
    cy.wait(1000);

    cy.contains("所有學期").should("be.hidden");
  });

  it("選擇 進階搜尋裡面「所有學期」的選項", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("#advanceSearch").check();
    cy.wait(1000);

    cy.get("select").first().select("所有學期");
    cy.get("table>tbody>tr").eq(0).find("th").first().should("contain", "110-下");
    cy.contains("Last").click();
    cy.get("table>tbody>tr").eq(-1).find("th").first().should("contain", "111-上");

    cy.wait(1000);
    cy.get("select").first().select("110-下");
    cy.get("table>tbody>tr").eq(0).find("th").first().should("contain", "110-下");
    cy.contains("Last").click();
    cy.get("table>tbody>tr").eq(-1).find("th").first().should("contain", "110-下");

    cy.wait(1000);
    cy.get("select").first().select("111-上");
    cy.get("table>tbody>tr").eq(0).find("th").first().should("contain", "111-上");
    cy.contains("Last").click();
    cy.get("table>tbody>tr").eq(-1).find("th").first().should("contain", "111-上");
  });

  it("選擇 進階搜尋裡面「開課單位」的選項", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("#advanceSearch").check();
    cy.wait(1000);

    cy.get("select").eq(1).find("option").each(($option, index) => {
      if(index == 0) {
        cy.get("select").eq(1).select(Cypress.$($option).text());
        cy.wait(1000);
        cy.get("table>tbody>tr").eq(0).find("th").eq(3).should("contain", "體育室");
      }
      else {
        cy.get("select").eq(1).select(Cypress.$($option).text());
        cy.wait(1000);
        cy.get("table>tbody>tr").eq(-1).find("th").eq(3).should("contain", Cypress.$($option).text());
      }
    });
    
  });

  it("click 課程", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("table>tbody>tr").eq(0).click();
    cy.wait(1000);

    cy.url().should("contain", "/courses/1");
  });

  it("click First", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.contains("First").click();

    cy.get("#page-input").should("have.value", "1");
  });

  it("click Prev", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.contains("Next").click();
    cy.wait(1000);
    cy.contains("Prev").click();

    cy.get("#page-input").should("have.value", "1");
  });

  it("click Next", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.contains("Next").click();

    cy.get("#page-input").should("have.value", "2");
  });

  it("click Last", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.contains("Last").click();

    cy.get("#page-input").should("have.value", "3");
  });
  
  it("type 數字框", () => {
    cy.visit("/courses");
    cy.wait(1000);
    cy.get("#page-input").type("{backspace}2{enter}");

    cy.get("#page-input").should("have.value", "2");
  });

  it("click 課程綱要", () => {
    cy.visit("/courses/1");
    cy.contains("課程綱要").should('have.attr', 'href', 'https://cis.ncu.edu.tw/Course/main/query/byKeywords?serialNo=1001&outline=1001&semester=1102')
  });

});
