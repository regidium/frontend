set :application,           "my.regidium.com"
set :domain,                "my.regidium.com"
set :deploy_to,             "/var/www/regidium.com/frontend"
set :web_path,              "web"
 
set :repository,            "git@github.com:regidium/frontend.git"
set :branch,                "master"
set :scm,                   :git
set :deploy_via,            :copy

role :web,                  domain, :primary => true
 
default_run_options[:pty] = true

set :keep_releases,         3
set :ssh_options,           {:forward_agent => true, :port => 22}
set :user,                  "deployer"
set :use_sudo,              false

set :shared_files,          [
                                "config/config.js",
                            ]

set :shared_children,       [
                                "node_modules",
                                "cache"
                            ]

logger.level = Logger::MAX_LEVEL

namespace :deploy do


  desc "Install node modules"
  task :npm_install do
    run "cd #{current_path} && npm install"
  end

  desc "Restart Supervisor"
  task :restart do
    run "sudo /usr/bin/supervisorctl restart my.regidium.com"
  end

end
 
after "deploy:create_symlink", "deploy:npm_install", "deploy:restart"