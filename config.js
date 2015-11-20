var config = module.exports = {
	repo: process.env.MAIL_MAN_REPO || process.env.PACKER_SERVER_REPO,
	branch: process.env.MAIL_MAN_BRANCH || || process.env.PACKER_SERVER_BRANCH
}

config.path = '../' + config.repo.split('/').pop()
config.remote = 'git@github.com:' + config.repo + '.git'