set :application,           "my.regidium.com"
set :domain,                "my.regidium.com"
set :deploy_to,             "/var/www/regidium.com/frontend"
set :web_path,              "web"
 
set :repository,            "git@github.com:regidium/frontend.git"
set :branch,                "master"
set :scm,                   :git
set :deploy_via,            :copy
 
default_run_options[:pty] = true

set :keep_releases,         3
set :ssh_options,           {:forward_agent => true, :port => 22}
set :user,                  "deployer"
set :use_sudo,              false

set :shared_children,       [
                                "node_modules",
                                "config"
                            ]

namespace :deploy do


  desc "Install node modules"
  task :npm_install do
    run "cd #{current_path} && npm install"
  end

  desc "Restart Supervisor"
  task :start do
    run "cd #{current_path} && touch app.js"
  end

end
 
after "deploy:create_symlink", "deploy:npm_install", "deploy:stop", "deploy:start"
