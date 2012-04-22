#!/bin/bash -e

PROJECT=jquery.sampling
TAR_FILE=$PROJECT"_docs_html$(date +s).tar"

echo "Entering sphinx source directory"
cd sphinx

echo "Generating HTML documentation..."
make html

echo "Saving documentation"
tar -cf /tmp/$TAR_FILE build/html/*

echo "Exiting sphinx source directory"
cd ..

echo "Switching to gh-pages branch"
git checkout gh-pages

echo "Cleaning the directory..."
git rm -rf *

echo "Restoring documentation"
tar -xf /tmp/$TAR_FILE .

echo "Commiting changes and pushing"
git add .
git commit -am "Documentaiton updated to $(date)"
git push 

echo "Switching to master branch"
git checkout master

echo "Done!"

exit 0