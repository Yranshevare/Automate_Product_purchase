# Generated by Django 5.1.6 on 2025-03-24 10:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Approvel', '0003_approvalmodel_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='approvalmodel',
            name='sequence_number',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
    ]
