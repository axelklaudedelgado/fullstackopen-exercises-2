const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, createBlogBackend } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/test/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Axel',
        username: 'Sey',
        password: '123'
      }
    })
    
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
        await loginWith(page, 'Sey', '123')
      
        await expect(page.getByText('Axel logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
        await loginWith(page, 'Sey', 'wrong')
      
        const errorDiv = page.locator('.error')
        await expect(errorDiv).toContainText('Wrong username or password')
        await expect(errorDiv).toHaveCSS('border-style', 'solid')
        await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      
        await expect(page.getByText('Axel logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
        let token 

        beforeEach(async ({ page }) => {
            token = await loginWith(page, 'Sey', '123', true)
        })
      
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'Let it go', 'Moira', 'moira.com')
            await expect(page.getByText('Let it Go Moira')).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await createBlog(page, 'Akdog', 'Sey', 'sey.com')
            const blogElement = page.getByText('Akdog Sey')
            await blogElement.getByRole('button', { name: 'view' }).click()
            await page.getByRole('button', { name: 'like' }).click()
            await expect(page.getByText('likes 1')).toBeVisible()
        })

        test('a blog created can be deleted', async ({ page }) => {
            await createBlog(page, 'Akdog', 'Sey', 'sey.com')
            const blogElement = page.getByText('Akdog Sey')
            await blogElement.getByRole('button', { name: 'view' }).click()

            page.on('dialog', async (dialog) => {
                if (dialog.type() === 'confirm') {
                  await dialog.accept()
                }
            })

            await page.getByRole('button', { name: 'remove' }).click()
            await expect(page.getByText('Akdog Sey')).not.toBeVisible()
        })

        describe('and logged out to use another user', () => {
            beforeEach(async ({ request }) => {
                await request.post('http://localhost:3003/api/users', {
                    data: {
                        name: 'Krinkle',
                        username: 'Dog',
                        password: '123'
                    }
                })
            })
          
            test('delete button is only visible to the user who added the blog', async ({ page }) => {
                await createBlog(page, 'Akdog', 'Sey', 'sey.com')
                await page.getByRole('button', { name: 'logout' }).click()
                await loginWith(page, 'Dog', '123')
                const blogElement = page.getByText('Akdog Sey')
                await blogElement.getByRole('button', { name: 'view' }).click()
                await expect(page.getByText('remove')).not.toBeVisible()
            })
        })

        describe('and several blogs exists', () => {
            beforeEach(async ({ page, request }) => {
                await createBlogBackend(request, token, 'Axel Book', 'Sey', 'axel.com', 23)
                await createBlogBackend(request, token, 'Krinkle Book', 'Dog', 'dog.com', 47)
                await createBlogBackend(request, token, 'No Book', 'No-one', 'none.com', 0)
                await page.reload();
            })

            test('blogs are arranged in the order according to the likes', async ({ page }) => {
                const firstElement = page.getByText('Krinkle Book')
                await firstElement.getByRole('button', { name: 'view' }).click()

                const secondElement = page.getByText('Axel Book')
                await secondElement.getByRole('button', { name: 'view' }).click()

                const thirdElement = page.getByText('No Book')
                await thirdElement.getByRole('button', { name: 'view' }).click()

                const blogsLikes = await page.locator('[data-testid="likes"]').all()
                const likesArray = []
                for (const entry of blogsLikes) {
                    const text = await entry.textContent();
                    likesArray.push(text)
                }

                const isSortedDescending = likesArray.every((like, i, arr) => i === 0 || arr[i - 1] >= like)
                expect(isSortedDescending).toBe(true)
            })
        })
    })
  })
})