set :application,           "my.regidium.com"
set :domain,                "my.regidium.com"
set :deploy_to,             "/var/www/regidium.com/my"
 
set :scm,                   :git
set :repository,            "git@github.com:regidium/api.git"

role :app,                  domain, :primary => true
 
default_run_options[:pty] = true
set :user,                  "deployer"
set :normalize_asset_timestamps, false

set :shared_children,       [
                                "node_modules",
                                "config/config",
                                "frontend/public/common/config/files"
                            ]

namespace :deploy do

  desc "Install node modules"
  task :npm_install do
    run "cd #{current_path} && npm install"
  end

end
 
after "deploy:create_symlink", "deploy:npm_install"
