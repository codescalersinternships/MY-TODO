/// <reference types="cypress" />


describe('myTodo app', () => {

  before(() => {
    // the url is written in the config file
    cy.visit('')
  })


  context('settings first load', () => {

    it('entering inputs & submitting', () => {
      // NAME FIELD
      cy.get(':nth-child(1) > [data-testid="dialog-input__input"]').type('Mr. Robot')
      // EMAIL FIELD
      cy.get(':nth-child(2) > [data-testid="dialog-input__input"]').type('Robot@gmail.com')
      // BACKGROUND IMAGE
      cy.get(':nth-child(5) > [data-testid="dialog-input__input"]').type('https://thumbs.dreamstime.com/b/tile-floor-brick-wall-background-lights-night-hd-image-large-resolution-can-be-used-as-desktop-wallpaper-real-zise-184215885.jpg')
      cy.get('[data-testid="prompt__submit-button"]').click()
    })
  })

  context('intial status of the app', () => {


    it('no wrong input message appears with input value 0', () => {
      cy.get('button.svelte-qxww7u').should('be.disabled')
    })
    it('list length is empty', () => {
      cy.get('.list-status').should('have.value', '')
      cy.get('.item').should('have.length', 0)
    })




  })


  context('can add new todo input validity', () => {
    const firstNameText = '123456789012345678901234567890123456789012345678901234567890';
    it('typing new item short length & button disabled', () => {
      cy.get('input.svelte-qxww7u').clear().type('short input')
      cy.get('.message').should('contain', 'Text must be at least 10 characters')
      cy.get('input.svelte-qxww7u').clear()
    })
    it('typing new item limits entry to 30 char', () => {
      cy.get('input.svelte-qxww7u')
        .clear()
        .type(firstNameText)
        .should('have.value', firstNameText.substring(0, 30));
    })
    it('typing new item correctly and button enabled then failed', () => {
      cy.get('input.svelte-qxww7u').clear().type('long enough input entered !')
      cy.get('button.svelte-qxww7u').should('be.enabled')
      cy.get('.list-status').click().should('have.value', '')
      cy.get('input.svelte-qxww7u').type("{backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace}")
      cy.get('input.svelte-qxww7u').type("{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace}{backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace} {backspace}")
      cy.get('button.svelte-qxww7u').should('be.disabled')
      cy.get('.list-status').click().should('have.value', '')
      cy.get('input.svelte-qxww7u').clear()
    })
  })


  context("CRUD on one item in the todolist", () => {

    it('entered 1 new item to the list and check the length of the list', () => {
      cy.get('input.svelte-qxww7u').clear().type('I want to eat burger!');
      cy.get('button.svelte-qxww7u').should('be.enabled');
      cy.get('.list-status').click().should('have.value', '');
      cy.get('button.svelte-qxww7u').click();
      cy.get('button.svelte-qxww7u').should('be.disabled');
      cy.get('.list').children().should('have.length', 3);
    }
    )
    it('update 1  item text to be completed', () => {
      cy.get('.text-input').click().clear().type('I want to play basketball!');
      cy.get('.text-input').should('have.value', 'I want to play basketball!');
    }
    )

    it('update 1  item status to be completed', () => {
      cy.get('.complete-checkbox').click();
      cy.get('.text-input').should('have.css', 'text-decoration', 'line-through solid rgb(102, 102, 102)');
    }
    )

    it('delete 1 item by double click', () => {

      cy.get('.item.status').dblclick();
      cy.on('window:confirm', () => true);

      cy.get('.list').children().should('have.length', 3);
    }
    )

  })

  context('CRUD on 5 items ', () => {
    it('entered 5 new item to the list and check the length of the list', () => {
      for (let i = 0; i < 5; i++) {

        cy.get('.text-input').wait(200);

        cy.get('.text-input').type(`I want to eat burger ${i} !!`).wait(200);

        cy.get('button.svelte-qxww7u').click().wait(200);
      }
    })
  })

})