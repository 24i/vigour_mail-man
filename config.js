var config = module.exports = {
  repo: process.env.MAIL_MAN_REPO,
  branch: process.env.MAIL_MAN_BRANCH
}

config.path = '../' + config.repo.split('/').pop()
config.remote = 'git@github.com:' + config.repo + '.git'
