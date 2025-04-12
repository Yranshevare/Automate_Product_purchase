from django.db import models

# Create your models here.
class POModel(models.Model):
    po_id = models.AutoField(primary_key=True)

    po_order_number = models.CharField(max_length=200)
    po_date = models.CharField(max_length=200)

    po_name = models.CharField(max_length=200)
    po_address = models.TextField()
    po_email = models.CharField(max_length=200)
    po_mobile_number = models.CharField(max_length=200)

    po_tableData = models.TextField()

    po_term_and_condition = models.TextField()

    process = models.ForeignKey('process.processModel', on_delete=models.CASCADE)

    def __str__(self):
        return self.process.title
