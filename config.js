var config = module.exports = {
	repo: process.env.REPO,
	branch: process.env.BRANCH
}

config.path = './' + config.repo.split('/').pop()
config.remote = 'git@github.com:' + config.repo + '.git'