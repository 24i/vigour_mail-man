var config = module.exports = {
	repo: process.env.REPO,
	branch: process.env.BRANCH
}

config.path = './' + config.repo.split('/').pop()
config.distBranch = config.branch + '-dist'
config.remote = 'git@github.com:' + config.repo + '.git'