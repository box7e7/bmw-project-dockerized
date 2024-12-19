
current_directory=$(pwd)

### echo "{msg:$current_directory}"


pdf_found=$(find "$(pwd)/scripts/tmp" -type f -name "*.pdf" | wc -l)

# Check if the count is greater than zero
if [ "$pdf_found" -gt 0 ]; then
    python3 $current_directory/scripts/sendEmail.py

    cp $current_directory/scripts/tmp/* $current_directory/scripts/pdf-files
    rm $current_directory/scripts/tmp/*
    echo "{log: 'copy successfull'}"
    # echo "There are PDF files."
    # Add your commands here to handle the case when PDF files are found
else
    echo "{error:'No PDF files found.'}"
    # Add your commands here for the case when no PDF files are found
fi




