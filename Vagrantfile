# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  config.vm.box = "hashicorp/precise32"
  config.vm.network :forwarded_port, guest: 8080, host: 8080

  config.vm.provision :shell,
    inline: 'wget -qO - https://raw.githubusercontent.com/groupbuddies/gb-puppet/master/setup/ubuntu | sh'

  config.vm.provision :puppet do |puppet|
    puppet.manifests_path = 'deploy/vagrant'
    puppet.manifest_file = 'manifest.pp'
  end
end
