# Generated by Django 5.1.6 on 2025-03-07 14:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Approvel', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='approvalmodel',
            name='response',
            field=models.TextField(default='no response'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='approvalmodel',
            name='status',
            field=models.CharField(choices=[('Accepted', 'Accepted'), ('Pending', 'Pending'), ('Rejected', 'Rejected')], default='Pending', max_length=20),
        ),
    ]
