require 'rake'
require 'rake/packagetask'
require 'yaml'

ROOT_DIR = File.expand_path(File.dirname(__FILE__))
SRC_DIR = File.join(ROOT_DIR, 'src')
DIST_DIR = File.join(ROOT_DIR,'dist')
EXAMPLE_DIR = File.join(ROOT_DIR,'examples/js')

RELEASE_DIR = File.join(DIST_DIR, 'release')

TEST_DIR      = File.join(ROOT_DIR, 'test')
TEST_UNIT_DIR = File.join(TEST_DIR, 'unit')
TMP_DIR       = File.join(TEST_UNIT_DIR, 'tmp')

task :default => [:clean, :dist,:examples]

desc "Clean the distribution directory."
task :clean do 
  rm_rf DIST_DIR
  mkdir DIST_DIR
  mkdir RELEASE_DIR
end

desc "Generates a minified version for distribution, using UglifyJS."
task :dist do
  cp File.join(SRC_DIR,'tipBox.js'), File.join(DIST_DIR,'tipBox.js')
  src, target = File.join(DIST_DIR,'tipBox.js'), File.join(RELEASE_DIR,'tipBox.min.js')
  uglifyjs src, target
  process_minified src, target
end

def uglifyjs(src, target)
  begin
    require 'uglifier'
  rescue LoadError => e
    if verbose
      puts "\nYou'll need the 'uglifier' gem for minification. Just run:\n\n"
      puts "  $ gem install uglifier"
      puts "\nand you should be all set.\n\n"
      exit
    end
    return false
  end
  puts "Minifying #{src} with UglifyJS..."
  File.open(target, "w"){|f| f.puts Uglifier.new.compile(File.read(src))}
end

def process_minified(src, target)
  cp target, File.join(DIST_DIR,'temp.js')
  msize = File.size(File.join(DIST_DIR,'temp.js'))
  `gzip -9 #{File.join(DIST_DIR,'temp.js')}`

  osize = File.size(src)
  dsize = File.size(File.join(DIST_DIR,'temp.js.gz'))
  rm_rf File.join(DIST_DIR,'temp.js.gz')

  puts "Original version: %.3fk" % (osize/1024.0)
  puts "Minified: %.3fk" % (msize/1024.0)
  puts "Minified and gzipped: %.3fk, compression factor %.3f" % [dsize/1024.0, osize/dsize.to_f]
end

task :examples do
  puts "Updating JS file in Examples dir..."
  rm_rf EXAMPLE_DIR
  mkdir EXAMPLE_DIR
  cp File.join(RELEASE_DIR,'tipBox.min.js'), File.join(EXAMPLE_DIR,'tipBox.min.js')
  puts "Updated!"
end
