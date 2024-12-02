const loginWith = async (page, username, password, accessToken=false)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()

    if(accessToken) {
        await page.waitForSelector('button:has-text("create new blog")', { state: 'visible'})

        const token = await page.evaluate(() => {
            const storedData = localStorage.getItem('loggedInUser')

            const parsedData = JSON.parse(storedData)
            return parsedData.token
        });

        return `Bearer ${token}`
    }
}

const createBlog = async (page, title, author, url) => {
    await page.getByRole('button', { name: 'create new blog' }).click()
    await page.getByTestId('title').fill(title)
    await page.getByTestId('author').fill(author)
    await page.getByTestId('url').fill(url)
    await page.getByRole('button', { name: 'create' }).click()
}

const createBlogBackend = async (request, token, title, author, url, likes) => {
    await request.post('http://localhost:3003/api/blogs', {
        headers: {
            'Content-Type': 'application/json',
            Authorization: token,
        },
        data: {
            title: title,
            author: author,
            url: url,
            likes: likes,
        }
    })
}

export { loginWith, createBlog, createBlogBackend }