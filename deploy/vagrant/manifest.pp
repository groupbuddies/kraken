class { 'nodejs':
  repo_url_suffix => 'node_0.10',
}

package { 'pm2':
  ensure   => 'present',
  provider => 'npm',
}
